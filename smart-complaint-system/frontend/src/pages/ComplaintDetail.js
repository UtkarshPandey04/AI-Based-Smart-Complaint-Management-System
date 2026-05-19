import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getComplaintById, updateComplaintStatus, analyzeComplaintById } from "../services/api";
import { useAuth } from "../context/AuthContext";

const statusClass = (status = "") => status.toLowerCase().replace(/\s+/g, "-");

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await getComplaintById(id);
        setComplaint(data.data);
        setStatus(data.data.status);
      } catch {
        toast.error("Complaint not found");
        navigate("/complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const { data } = await updateComplaintStatus(id, { status });
      setComplaint(data.data);
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed. Login as admin.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!user) {
      toast.warn("Please login to run AI analysis");
      return;
    }

    setAiLoading(true);
    try {
      const { data } = await analyzeComplaintById(id);
      setComplaint((current) => ({
        ...current,
        aiAnalysis: {
          ...data.data,
          analyzedAt: new Date().toISOString(),
        },
      }));
      toast.success("AI analysis complete");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="center-state">Loading complaint...</div>;
  if (!complaint) return null;

  const ai = complaint.aiAnalysis;

  return (
    <main className="detail-page">
      <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">
        Back
      </button>

      <article className="card detail-card" style={{ marginTop: "1rem" }}>
        <div className="detail-top">
          <div>
            <span className="badge category">{complaint.category}</span>
            <h1 className="detail-title">{complaint.title}</h1>
          </div>
          <span className={`badge ${statusClass(complaint.status)}`}>{complaint.status}</span>
        </div>

        <section className="meta-panel">
          <div>
            <span className="label">Name</span>
            {complaint.name}
          </div>
          <div>
            <span className="label">Email</span>
            {complaint.email}
          </div>
          <div>
            <span className="label">Location</span>
            {complaint.location}
          </div>
          <div>
            <span className="label">Filed</span>
            {new Date(complaint.createdAt).toLocaleString()}
          </div>
        </section>

        <section className="detail-section">
          <h3>Description</h3>
          <p className="muted">{complaint.description}</p>
        </section>

        {user && (
          <section className="detail-section">
            <h3>Update Status</h3>
            <div className="status-row">
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {["Pending", "In Progress", "Resolved", "Rejected"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleStatusUpdate}
                className="btn btn-primary"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </section>
        )}

        <section className="detail-section">
          <div className="ai-header">
            <h3>AI Analysis</h3>
            <button type="button" onClick={handleAIAnalyze} className="btn btn-ai" disabled={aiLoading}>
              {aiLoading ? "Analyzing..." : ai?.priority ? "Re-Analyze" : "Run AI Analysis"}
            </button>
          </div>

          {ai?.priority ? (
            <div className="ai-result">
              <div className="ai-grid">
                <div>
                  <span className="label">Priority</span>
                  <span className={`badge ${String(ai.priority || "").toLowerCase()}`}>{ai.priority}</span>
                </div>
                <div>
                  <span className="label">Department</span>
                  <strong>{ai.department}</strong>
                </div>
              </div>
              <div>
                <span className="label">Summary</span>
                <p className="muted">{ai.summary}</p>
              </div>
              <div className="ai-note">
                <span className="label">Auto Response</span>
                {ai.autoResponse}
              </div>
              {ai.analyzedAt && (
                <p className="muted">Analyzed: {new Date(ai.analyzedAt).toLocaleString()}</p>
              )}
            </div>
          ) : (
            <p className="muted">No AI analysis yet. Run analysis to generate routing and priority details.</p>
          )}
        </section>
      </article>
    </main>
  );
};

export default ComplaintDetail;
