import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI Triage",
    desc: "Detect priority, responsible department, tags, and a citizen-ready response from the complaint text.",
  },
  {
    title: "Live Tracking",
    desc: "Follow complaint status, search by location, filter categories, and inspect each case from one workspace.",
  },
  {
    title: "Secure Access",
    desc: "JWT authentication keeps staff actions protected while public submissions stay fast and simple.",
  },
  {
    title: "Operational View",
    desc: "Admins can review, update, and resolve complaints without losing the original citizen context.",
  },
];

const categories = [
  "Water Supply",
  "Electricity",
  "Roads & Infrastructure",
  "Sanitation & Garbage",
  "Public Safety",
  "Healthcare",
  "Education",
  "Transportation",
];

const Home = () => (
  <main className="page">
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Citizen service desk</span>
        <h1>Resolve civic complaints faster with AI-assisted routing.</h1>
        <p>
          A React complaint portal for filing, analyzing, tracking, and resolving
          public service issues through a cleaner digital workflow.
        </p>
        <div className="hero-actions">
          <Link to="/submit" className="btn btn-primary">
            Submit Complaint
          </Link>
          <Link to="/complaints" className="btn btn-secondary">
            View Complaints
          </Link>
        </div>
      </div>

      <aside className="insight-panel" aria-label="System highlights">
        <div className="metric-card">
          <div className="metric-value">24/7</div>
          <div className="metric-label">Online complaint intake</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">AI</div>
          <div className="metric-label">Priority and department suggestions</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">4</div>
          <div className="metric-label">Trackable resolution states</div>
        </div>
      </aside>
    </section>

    <section>
      <h2 className="section-title">What the system handles</h2>
      <div className="grid">
        {features.map((feature) => (
          <article key={feature.title} className="card feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="card" style={{ marginTop: "1rem" }}>
      <h2 className="section-title">Supported Categories</h2>
      <div className="category-list">
        {categories.map((category) => (
          <span key={category} className="chip">
            {category}
          </span>
        ))}
      </div>
    </section>
  </main>
);

export default Home;
