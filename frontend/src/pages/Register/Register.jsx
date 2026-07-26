import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import { registerUser } from "../../services/api";
import "../Login/Login.css";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
    caption: "Join DriveNow and hit the road today.",
  },
  {
    src: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
    caption: "Flexible rentals for every journey.",
  },
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-slider-panel">
        <ImageSlider slides={slides} intervalMs={4500} />
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <h1 className="brand-title">Create Account</h1>
          <p className="brand-subtitle">Sign up to start booking cars</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />

            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />

            <label>Phone Number</label>
            <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />

            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />

            <button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
