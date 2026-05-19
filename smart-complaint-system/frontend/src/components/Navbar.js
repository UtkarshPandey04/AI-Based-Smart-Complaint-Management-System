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
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">SC</span>
        <span>SmartComplaint AI</span>
      </Link>

      <div className="nav-links">
        <Link to="/complaints" className="nav-link">
          Complaints
        </Link>
        <Link to="/submit" className="nav-link">
          Submit
        </Link>
        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button type="button" onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
