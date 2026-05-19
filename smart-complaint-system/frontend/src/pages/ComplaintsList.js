import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllComplaints, searchByLocation, deleteComplaint } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["All", "Water Supply", "Electricity", "Roads & Infrastructure", "Sanitation & Garbage", "Public Safety", "Healthcare", "Education", "Transportation", "Other"];
const STATUS_COLORS = { Pending: "#f39c12", "In Progress": "#3498db", Resolved: "#27ae60", Rejected: "#e74c3c" };

const ComplaintsList = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [locationSearch, setLocationSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      if (locationSearch.trim()) {
        const { data } = await searchByLocation(locationSearch.trim());
        setComplaints(data.data);
        setPagination({});
      } else {
        const params = { page, limit: 8 };
        if (category !== "All") params.category = category;
        const { data } = await getAllComplaints(params);
        setComplaints(data.data);
        setPagination(data.pagination);
      }
    } catch {
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  }, [category, locationSearch, page]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await deleteComplaint(id);
      toast.success("Complaint deleted");
      fetchComplaints();
    } catch {
      toast.error("Failed to delete. Are you logged in as admin?");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>📋 All Complaints</h2>

        {/* Filters */}
        <div style={styles.filters}>
          <input
            placeholder="🔍 Search by location..."
            value={locationSearch}
            onChange={(e) => { setLocationSearch(e.target.value); setPage(1); }}
            style={styles.searchInput}
          />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} style={styles.select}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => { setLocationSearch(""); setCategory("All"); setPage(1); }} style={styles.clearBtn}>Clear</button>
        </div>

        {loading ? (
          <div style={styles.center}>⏳ Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div style={styles.center}>No complaints found.</div>
        ) : (
          <div style={styles.grid}>
            {complaints.map((c) => (
              <div key={c._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.category}>{c.category}</span>
                  <span style={{ ...styles.statusBadge, background: STATUS_COLORS[c.status] || "#888" }}>
                    {c.status}
                  </span>
                </div>
                <h3 style={styles.cardTitle}>{c.title}</h3>
                <p style={styles.cardDesc}>{c.description.substring(0, 100)}...</p>
                <div style={styles.cardMeta}>
                  <span>👤 {c.name}</span>
                  <span>📍 {c.location}</span>
                  <span>📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                {c.aiAnalysis?.priority && (
                  <div style={styles.aiTag}>🤖 AI Priority: <strong>{c.aiAnalysis.priority}</strong></div>
                )}
                <div style={styles.cardActions}>
                  <Link to={`/complaints/${c._id}`} style={styles.viewBtn}>View Details</Link>
                  {user && (
                    <button onClick={() => handleDelete(c._id)} style={styles.deleteBtn}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={styles.pagination}>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} style={styles.pageBtn}>← Prev</button>
            <span style={styles.pageInfo}>Page {pagination.page} of {pagination.totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages} style={styles.pageBtn}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { background: "#f0f4f8", minHeight: "100vh", padding: "2rem 1rem" },
  container: { maxWidth: "1100px", margin: "0 auto" },
  title: { color: "#1e3a5f", fontSize: "1.8rem", marginBottom: "1.5rem" },
  filters: { display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" },
  searchInput: { flex: 2, padding: "0.7rem", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "1rem", minWidth: "200px" },
  select: { flex: 1, padding: "0.7rem", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "0.95rem", minWidth: "160px" },
  clearBtn: { padding: "0.7rem 1.2rem", background: "#95a5a6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  center: { textAlign: "center", padding: "3rem", color: "#888", fontSize: "1.1rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.2rem" },
  card: { background: "#fff", borderRadius: "12px", padding: "1.3rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "0.6rem" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  category: { background: "#eaf3fb", color: "#2980b9", padding: "0.2rem 0.7rem", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" },
  statusBadge: { color: "#fff", padding: "0.2rem 0.7rem", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" },
  cardTitle: { margin: 0, color: "#1e3a5f", fontSize: "1.05rem" },
  cardDesc: { color: "#666", fontSize: "0.9rem", margin: 0, lineHeight: "1.5" },
  cardMeta: { display: "flex", gap: "0.8rem", flexWrap: "wrap", fontSize: "0.8rem", color: "#888" },
  aiTag: { background: "#f3e8ff", color: "#8e44ad", padding: "0.3rem 0.7rem", borderRadius: "8px", fontSize: "0.85rem" },
  cardActions: { display: "flex", gap: "0.6rem", marginTop: "0.3rem" },
  viewBtn: { flex: 1, textAlign: "center", padding: "0.5rem", background: "#1e3a5f", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem" },
  deleteBtn: { padding: "0.5rem 0.8rem", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem" },
  pageBtn: { padding: "0.6rem 1.2rem", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", disabled: { opacity: 0.5 } },
  pageInfo: { color: "#555" },
};

export default ComplaintsList;
