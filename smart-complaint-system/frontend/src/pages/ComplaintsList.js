import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllComplaints, searchByLocation, deleteComplaint } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "All",
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

const statusClass = (status = "") => status.toLowerCase().replace(/\s+/g, "-");

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
    <main className="page">
      <header className="page-header">
        <span className="eyebrow">Operations</span>
        <h1>All complaints</h1>
        <p className="muted">Review submitted issues, filter by category, and inspect AI priority notes.</p>
      </header>

      <section className="filters">
        <input
          className="input"
          placeholder="Search by location"
          value={locationSearch}
          onChange={(e) => {
            setLocationSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setLocationSearch("");
            setCategory("All");
            setPage(1);
          }}
        >
          Clear
        </button>
      </section>

      {loading ? (
        <div className="center-state">Loading complaints...</div>
      ) : complaints.length === 0 ? (
        <div className="center-state">No complaints found.</div>
      ) : (
        <section className="complaint-grid">
          {complaints.map((complaint) => (
            <article key={complaint._id} className="card complaint-card">
              <div className="card-top">
                <span className="badge category">{complaint.category}</span>
                <span className={`badge ${statusClass(complaint.status)}`}>{complaint.status}</span>
              </div>
              <div>
                <h3>{complaint.title}</h3>
                <p>{complaint.description.substring(0, 120)}...</p>
              </div>
              <div className="meta">
                <span>{complaint.name}</span>
                <span>{complaint.location}</span>
                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>
              {complaint.aiAnalysis?.priority && (
                <div className="ai-note">
                  AI Priority: <strong>{complaint.aiAnalysis.priority}</strong>
                </div>
              )}
              <div className="card-actions">
                <Link to={`/complaints/${complaint._id}`} className="btn btn-primary">
                  View Details
                </Link>
                {user && (
                  <button
                    type="button"
                    onClick={() => handleDelete(complaint._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            onClick={() => setPage((current) => current - 1)}
            disabled={page === 1}
            className="btn btn-secondary"
          >
            Prev
          </button>
          <span className="muted">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={page === pagination.totalPages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default ComplaintsList;
