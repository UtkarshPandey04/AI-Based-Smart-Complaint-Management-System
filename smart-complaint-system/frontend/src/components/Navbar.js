import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        🏛️ SmartComplaint AI
      </Link>
      <div style={styles.links}>
        <Link to="/complaints" style={styles.link}>All Complaints</Link>
        <Link to="/submit" style={styles.link}>Submit Complaint</Link>
        {user ? (
          <>
            <span style={styles.userBadge}>👤 {user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "0 2rem", height: "64px", background: "#1e3a5f",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)", position: "sticky", top: 0, zIndex: 100,
  },
  brand: {
    color: "#fff", textDecoration: "none", fontSize: "1.3rem", fontWeight: "700",
  },
  links: { display: "flex", alignItems: "center", gap: "1rem" },
  link: { color: "#b8d4f0", textDecoration: "none", fontSize: "0.95rem" },
  userBadge: { color: "#7ec8e3", fontSize: "0.9rem" },
  logoutBtn: {
    background: "#e74c3c", color: "#fff", border: "none",
    padding: "0.4rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem",
  },
  registerBtn: {
    background: "#2980b9", color: "#fff", textDecoration: "none",
    padding: "0.4rem 1rem", borderRadius: "6px", fontSize: "0.9rem",
  },
};

export default Navbar;
