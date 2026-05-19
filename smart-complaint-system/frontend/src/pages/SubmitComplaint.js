import React, { useState } from "react";
import { toast } from "react-toastify";
import { addComplaint, analyzeComplaint } from "../services/api";

const CATEGORIES = [
  "Water Supply", "Electricity", "Roads & Infrastructure",
  "Sanitation & Garbage", "Public Safety", "Healthcare",
  "Education", "Transportation", "Other",
];

const SubmitComplaint = () => {
  const [form, setForm] = useState({
    name: "", email: "", title: "", description: "", category: "", location: "",
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
      toast.success("✅ Complaint submitted successfully!");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        errors.forEach((e) => toast.error(e.message));
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
        title: form.title, description: form.description,
        category: form.category, location: form.location,
        complaintId: submitted?._id,
      });
      setAiResult(data.data);
      toast.success("🤖 AI analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  const priorityColor = { Low: "#27ae60", Medium: "#f39c12", High: "#e67e22", Critical: "#e74c3c" };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>📝 Submit a Complaint</h2>
        <p style={styles.sub}>Fill in the details below. You can also get an AI analysis before submitting.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.group}>
              <label style={styles.label}>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="Rahul Kumar" required />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="rahul@gmail.com" required />
            </div>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Complaint Title *</label>
            <input name="title" value={form.title} onChange={handleChange} style={styles.input} placeholder="e.g. Water Leakage Issue" required />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} style={{ ...styles.input, height: "120px", resize: "vertical" }} placeholder="Describe your complaint in detail..." required />
          </div>

          <div style={styles.row}>
            <div style={styles.group}>
              <label style={styles.label}>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} style={styles.input} required>
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Location *</label>
              <input name="location" value={form.location} onChange={handleChange} style={styles.input} placeholder="e.g. Ghaziabad, Sector 10" required />
            </div>
          </div>

          <div style={styles.btnRow}>
            <button type="button" onClick={handleAIAnalyze} style={styles.aiBtn} disabled={aiLoading}>
              {aiLoading ? "⏳ Analyzing..." : "🤖 AI Pre-Analysis"}
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? "Submitting..." : "📤 Submit Complaint"}
            </button>
          </div>
        </form>

        {/* AI Result Display */}
        {aiResult && (
          <div style={styles.aiCard}>
            <h3 style={styles.aiTitle}>🤖 AI Analysis Result</h3>
            <div style={styles.aiGrid}>
              <div style={styles.aiItem}>
                <span style={styles.aiKey}>Priority</span>
                <span style={{ ...styles.aiBadge, background: priorityColor[aiResult.priority] || "#888" }}>
                  {aiResult.priority}
                </span>
              </div>
              <div style={styles.aiItem}>
                <span style={styles.aiKey}>Department</span>
                <span style={styles.aiVal}>{aiResult.department}</span>
              </div>
              <div style={styles.aiItem}>
                <span style={styles.aiKey}>Est. Resolution</span>
                <span style={styles.aiVal}>{aiResult.estimatedResolutionDays} days</span>
              </div>
              {aiResult.tags && (
                <div style={styles.aiItem}>
                  <span style={styles.aiKey}>Tags</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {aiResult.tags.map((t) => <span key={t} style={styles.tag}>{t}</span>)}
                  </div>
                </div>
              )}
            </div>
            <div style={styles.aiSection}>
              <strong>📋 Summary:</strong>
              <p style={styles.aiText}>{aiResult.summary}</p>
            </div>
            <div style={styles.aiSection}>
              <strong>💬 Auto Response to Citizen:</strong>
              <p style={styles.aiText}>{aiResult.autoResponse}</p>
            </div>
          </div>
        )}

        {/* Success message */}
        {submitted && (
          <div style={styles.successCard}>
            <h3>✅ Complaint Submitted!</h3>
            <p>Your complaint ID: <strong>{submitted._id}</strong></p>
            <p>Status: <strong>{submitted.status}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { background: "#f0f4f8", minHeight: "100vh", padding: "2rem 1rem" },
  container: { maxWidth: "780px", margin: "0 auto" },
  title: { color: "#1e3a5f", fontSize: "1.8rem", marginBottom: "0.3rem" },
  sub: { color: "#666", marginBottom: "2rem" },
  form: { background: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  group: { marginBottom: "1.2rem" },
  label: { display: "block", marginBottom: "0.3rem", color: "#444", fontWeight: "600", fontSize: "0.9rem" },
  input: { width: "100%", padding: "0.7rem", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "1rem", boxSizing: "border-box", fontFamily: "inherit" },
  btnRow: { display: "flex", gap: "1rem", marginTop: "0.5rem" },
  aiBtn: { flex: 1, padding: "0.8rem", background: "#8e44ad", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "1rem" },
  submitBtn: { flex: 1, padding: "0.8rem", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "1rem" },
  aiCard: { background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginTop: "1.5rem", borderLeft: "4px solid #8e44ad" },
  aiTitle: { color: "#8e44ad", marginBottom: "1rem" },
  aiGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1rem" },
  aiItem: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  aiKey: { fontSize: "0.8rem", color: "#888", fontWeight: "600", textTransform: "uppercase" },
  aiVal: { fontSize: "1rem", color: "#333" },
  aiBadge: { display: "inline-block", color: "#fff", padding: "0.2rem 0.7rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700", width: "fit-content" },
  tag: { background: "#eee", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.8rem", color: "#555" },
  aiSection: { marginTop: "0.8rem" },
  aiText: { color: "#444", marginTop: "0.3rem", lineHeight: "1.6" },
  successCard: { background: "#d4edda", padding: "1.5rem", borderRadius: "12px", marginTop: "1.5rem", borderLeft: "4px solid #27ae60", color: "#155724" },
};

export default SubmitComplaint;
