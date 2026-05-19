import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Login successful!");
      navigate("/complaints");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔑 Login</h2>
        <p style={styles.sub}>Sign in to manage your complaints</p>
        <form onSubmit={handleSubmit}>
          {["email", "password"].map((field) => (
            <div key={field} style={styles.group}>
              <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === "password" ? "password" : "email"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                style={styles.input}
                placeholder={`Enter your ${field}`}
                required
              />
            </div>
          ))}
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={styles.foot}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f8" },
  card: { background: "#fff", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: "420px" },
  title: { margin: "0 0 0.25rem", color: "#1e3a5f", fontSize: "1.6rem" },
  sub: { color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" },
  group: { marginBottom: "1.2rem" },
  label: { display: "block", marginBottom: "0.3rem", color: "#444", fontWeight: "600", fontSize: "0.9rem" },
  input: { width: "100%", padding: "0.7rem", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "1rem", boxSizing: "border-box" },
  btn: { width: "100%", padding: "0.8rem", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", cursor: "pointer", fontWeight: "600" },
  foot: { textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "#666" },
};

export default Login;
