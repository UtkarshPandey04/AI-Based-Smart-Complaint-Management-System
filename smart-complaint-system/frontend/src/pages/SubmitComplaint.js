import React, { useState } from "react";
import { toast } from "react-toastify";
import { addComplaint, analyzeComplaint } from "../services/api";

const CATEGORIES = [
  "Water Supply",
  "Electricity",
  "Roads & Infrastructure",
  "Sanitation & Garbage",
  "Public Safety",
  "Healthcare",
  "Education",
  "Transportation",
  "Other",
];

const SubmitComplaint = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    category: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [aiResult, setAiResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await addComplaint(form);
      setSubmitted(data.data);
      toast.success("Complaint submitted successfully");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        errors.forEach((error) => toast.error(error.message));
      } else {
        toast.error(err.response?.data?.message || "Submission failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!form.title || !form.description) {
      toast.warn("Please fill title and description first");
      return;
    }

    setAiLoading(true);
    setAiResult(null);
    try {
      const { data } = await analyzeComplaint({
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        complaintId: submitted?._id,
      });
      setAiResult(data.data);
      toast.success("AI analysis complete");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <main className="form-page">
      <header className="page-header">
        <span className="eyebrow">New complaint</span>
        <h1>Submit a complaint</h1>
        <p className="muted">
          Add the citizen details and issue context. You can run AI pre-analysis before or after submitting.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          <div className="field">
            <label>Full Name</label>
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Rahul Kumar"
              required
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="rahul@example.com"
              required
            />
          </div>
          <div className="field full">
            <label>Complaint Title</label>
            <input
              className="input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Water leakage near main road"
              required
            />
          </div>
          <div className="field full">
            <label>Description</label>
            <textarea
              className="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the complaint with enough detail for the department to act."
              required
            />
          </div>
          <div className="field">
            <label>Category</label>
            <select
              className="select"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Location</label>
            <input
              className="input"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Ghaziabad, Sector 10"
              required
            />
          </div>
        </div>

        <div className="button-row">
          <button type="button" onClick={handleAIAnalyze} className="btn btn-ai" disabled={aiLoading}>
            {aiLoading ? "Analyzing..." : "Run AI Pre-Analysis"}
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>
      </form>

      {aiResult && (
        <section className="card" style={{ marginTop: "1rem" }}>
          <h2 className="section-title">AI Analysis Result</h2>
          <div className="ai-grid">
            <div>
              <span className="label">Priority</span>
              <span className={`badge ${String(aiResult.priority || "").toLowerCase()}`}>
                {aiResult.priority}
              </span>
            </div>
            <div>
              <span className="label">Department</span>
              <strong>{aiResult.department}</strong>
            </div>
            <div>
              <span className="label">Estimated Resolution</span>
              <strong>{aiResult.estimatedResolutionDays} days</strong>
            </div>
            {aiResult.tags && (
              <div>
                <span className="label">Tags</span>
                <div className="category-list">
                  {aiResult.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="muted">{aiResult.summary}</p>
          <div className="ai-note">{aiResult.autoResponse}</div>
        </section>
      )}

      {submitted && (
        <section className="success-box">
          <h3>Complaint submitted</h3>
          <p>
            Complaint ID: <strong>{submitted._id}</strong>
          </p>
          <p>
            Status: <strong>{submitted.status}</strong>
          </p>
        </section>
      )}
    </main>
  );
};

export default SubmitComplaint;
