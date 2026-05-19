import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div style={styles.page}>
    <div style={styles.hero}>
      <h1 style={styles.heroTitle}>🏛️ AI-Powered Smart Complaint Management</h1>
      <p style={styles.heroSub}>
        Submit government complaints online. Get instant AI-powered priority detection,
        department routing, and automated responses. Track your complaint in real-time.
      </p>
      <div style={styles.heroBtns}>
        <Link to="/submit" style={styles.primaryBtn}>📝 Submit Complaint</Link>
        <Link to="/complaints" style={styles.secondaryBtn}>📋 View All Complaints</Link>
      </div>
    </div>

    <div style={styles.features}>
      {[
        { icon: "🤖", title: "AI Analysis", desc: "Anthropic Claude AI analyzes your complaint to detect priority, suggest department, and generate an automated response." },
        { icon: "🔍", title: "Smart Tracking", desc: "Track your complaint status in real-time. Filter by category, search by location, and get status updates." },
        { icon: "🔐", title: "Secure Auth", desc: "JWT-based authentication with bcrypt password hashing ensures your account and data are protected." },
        { icon: "📊", title: "Admin Dashboard", desc: "Admins can view all complaints, update statuses, and manage the system efficiently." },
      ].map((f) => (
        <div key={f.title} style={styles.featureCard}>
          <div style={styles.featureIcon}>{f.icon}</div>
          <h3 style={styles.featureTitle}>{f.title}</h3>
          <p style={styles.featureDesc}>{f.desc}</p>
        </div>
      ))}
    </div>

    <div style={styles.categories}>
      <h2 style={styles.catTitle}>Supported Complaint Categories</h2>
      <div style={styles.catGrid}>
        {["💧 Water Supply", "⚡ Electricity", "🛣️ Roads & Infrastructure", "🗑️ Sanitation & Garbage", "🚨 Public Safety", "🏥 Healthcare", "📚 Education", "🚌 Transportation"].map((c) => (
          <div key={c} style={styles.catChip}>{c}</div>
        ))}
      </div>
    </div>
  </div>
);

const styles = {
  page: { background: "#f0f4f8" },
  hero: { background: "linear-gradient(135deg, #1e3a5f 0%, #2980b9 100%)", color: "#fff", padding: "5rem 2rem", textAlign: "center" },
  heroTitle: { fontSize: "2.4rem", margin: "0 0 1rem", fontWeight: "800" },
  heroSub: { fontSize: "1.15rem", maxWidth: "600px", margin: "0 auto 2rem", opacity: 0.9, lineHeight: "1.7" },
  heroBtns: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" },
  primaryBtn: { background: "#fff", color: "#1e3a5f", padding: "0.9rem 2rem", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "1.05rem" },
  secondaryBtn: { background: "transparent", color: "#fff", border: "2px solid #fff", padding: "0.9rem 2rem", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "1.05rem" },
  features: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", padding: "4rem 2rem", maxWidth: "1100px", margin: "0 auto" },
  featureCard: { background: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", textAlign: "center" },
  featureIcon: { fontSize: "2.5rem", marginBottom: "0.8rem" },
  featureTitle: { color: "#1e3a5f", margin: "0 0 0.5rem", fontSize: "1.15rem" },
  featureDesc: { color: "#666", lineHeight: "1.6", margin: 0, fontSize: "0.95rem" },
  categories: { background: "#fff", padding: "3rem 2rem", textAlign: "center" },
  catTitle: { color: "#1e3a5f", fontSize: "1.6rem", marginBottom: "1.5rem" },
  catGrid: { display: "flex", flexWrap: "wrap", gap: "0.8rem", justifyContent: "center", maxWidth: "800px", margin: "0 auto" },
  catChip: { background: "#eaf3fb", color: "#2980b9", padding: "0.5rem 1.2rem", borderRadius: "24px", fontWeight: "600", fontSize: "0.95rem" },
};

export default Home;
