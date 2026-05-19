import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getComplaintById, updateComplaintStatus, analyzeComplaintById } from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = { Pending: "#f39c12", "In Progress": "#3498db", Resolved: "#27ae60", Rejected: "#e74c3c" };
const PRIORITY_COLORS = { Low: "#27ae60", Medium: "#f39c12", High: "#e67e22", Critical: "#e74c3c" };

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
    const fetch = async () => {
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
    fetch();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const { data } = await updateComplaintStatus(id, { status });
      setComplaint(data.data);
      toast.success("Status updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed. Login as admin.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!user) { toast.warn("Please login to run AI analysis"); return; }
    setAiLoading(true);
    try {
      const { data } = await analyzeComplaintById(id);
      setComplaint((prev) => ({
        ...prev,
        aiAnalysis: {
          ...data.data,
          analyzedAt: new Date().toISOString(),
        },
      }));
      toast.success("🤖 AI Analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div style={styles.center}>⏳ Loading...</div>;
  if (!complaint) return null;

  const ai = complaint.aiAnalysis;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

        <div style={styles.card}>
          <div style={styles.header}>
            <div>
              <span style={styles.category}>{complaint.category}</span>
              <h2 style={styles.title}>{complaint.title}</h2>
            </div>
            <span style={{ ...styles.statusBadge, background: STATUS_COLORS[complaint.status] }}>
              {complaint.status}
            </span>
          </div>

          <div style={styles.metaGrid}>
            <div><strong>👤 Name:</strong> {complaint.name}</div>
            <div><strong>📧 Email:</strong> {complaint.email}</div>
            <div><strong>📍 Location:</strong> {complaint.location}</div>
            <div><strong>📅 Filed:</strong> {new Date(complaint.createdAt).toLocaleString()}</div>
          </div>

          <div style={styles.section}>
            <h4>📋 Description</h4>
            <p style={styles.desc}>{complaint.description}</p>
          </div>

          {/* Status Update (admin) */}
          {user && (
            <div style={styles.section}>
              <h4>🔄 Update Status</h4>
              <div style={styles.statusRow}>
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
                  {["Pending", "In Progress", "Resolved", "Rejected"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button onClick={handleStatusUpdate} style={styles.updateBtn} disabled={updating}>
                  {updating ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          )}

          {/* AI Analysis */}
          <div style={styles.section}>
            <div style={styles.aiHeader}>
              <h4>🤖 AI Analysis</h4>
              <button onClick={handleAIAnalyze} style={styles.aiBtn} disabled={aiLoading}>
                {aiLoading ? "⏳ Analyzing..." : ai?.priority ? "🔄 Re-Analyze" : "🤖 Run AI Analysis"}
              </button>
            </div>

            {ai?.priority ? (
              <div style={styles.aiResult}>
                <div style={styles.aiGrid}>
                  <div style={styles.aiItem}>
                    <span style={styles.aiLabel}>Priority</span>
                    <span style={{ ...styles.aiBadge, background: PRIORITY_COLORS[ai.priority] || "#888" }}>
                      {ai.priority}
                    </span>
                  </div>
                  <div style={styles.aiItem}>
                    <span style={styles.aiLabel}>Department</span>
                    <span style={styles.aiVal}>{ai.department}</span>
                  </div>
                </div>
                <div style={styles.aiSection}>
                  <strong>📋 Summary:</strong>
                  <p style={styles.aiText}>{ai.summary}</p>
                </div>
                <div style={styles.aiSection}>
                  <strong>💬 Auto Response:</strong>
                  <p style={styles.aiText}>{ai.autoResponse}</p>
                </div>
                {ai.analyzedAt && (
                  <p style={styles.aiDate}>Analyzed: {new Date(ai.analyzedAt).toLocaleString()}</p>
                )}
              </div>
            ) : (
              <p style={styles.noAi}>No AI analysis yet. Click the button above to analyze.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: "#f0f4f8", minHeight: "100vh", padding: "2rem 1rem" },
  container: { maxWidth: "760px", margin: "0 auto" },
  center: { textAlign: "center", padding: "5rem", fontSize: "1.2rem", color: "#888" },
  backBtn: { background: "none", border: "1.5px solid #1e3a5f", color: "#1e3a5f", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", marginBottom: "1.2rem", fontWeight: "600" },
  card: { background: "#fff", borderRadius: "14px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" },
  category: { background: "#eaf3fb", color: "#2980b9", padding: "0.2rem 0.7rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600" },
  title: { color: "#1e3a5f", margin: "0.4rem 0 0", fontSize: "1.5rem" },
  statusBadge: { color: "#fff", padding: "0.3rem 1rem", borderRadius: "20px", fontWeight: "700", fontSize: "0.9rem", whiteSpace: "nowrap" },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem 2rem", background: "#f8f9fa", padding: "1rem", borderRadius: "8px", marginBottom: "1.2rem", fontSize: "0.95rem", color: "#555" },
  section: { borderTop: "1px solid #eee", paddingTop: "1.2rem", marginTop: "1.2rem" },
  desc: { color: "#444", lineHeight: "1.7", margin: 0 },
  statusRow: { display: "flex", gap: "1rem" },
  select: { flex: 1, padding: "0.6rem", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "1rem" },
  updateBtn: { padding: "0.6rem 1.5rem", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  aiHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  aiBtn: { padding: "0.5rem 1rem", background: "#8e44ad", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  aiResult: { background: "#fdf3ff", borderRadius: "8px", padding: "1rem", marginTop: "0.8rem" },
  aiGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" },
  aiItem: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  aiLabel: { fontSize: "0.75rem", color: "#888", fontWeight: "700", textTransform: "uppercase" },
  aiVal: { fontSize: "1rem", color: "#333" },
  aiBadge: { color: "#fff", padding: "0.25rem 0.7rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700", width: "fit-content" },
  aiSection: { marginTop: "0.8rem" },
  aiText: { color: "#444", marginTop: "0.3rem", lineHeight: "1.6" },
  aiDate: { fontSize: "0.8rem", color: "#999", marginTop: "0.8rem" },
  noAi: { color: "#999", fontStyle: "italic", marginTop: "0.5rem" },
};

export default ComplaintDetail;
