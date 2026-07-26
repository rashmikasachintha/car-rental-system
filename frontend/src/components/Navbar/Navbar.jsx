import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">DriveNow</Link>
      <div className="navbar-links">
        <Link to="/cars">Browse Cars</Link>
        {user && !isAdmin && <Link to="/dashboard">My Bookings</Link>}
        {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
        {user ? (
          <button className="navbar-logout" onClick={handleLogout}>
            Logout ({user.fullName?.split(" ")[0]})
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
