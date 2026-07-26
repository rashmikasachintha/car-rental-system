import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getBookingsByUser, cancelBooking } from "../../services/api";
import { formatLKR } from "../../utils/currency";
import "./Dashboard.css";

const statusColors = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  ONGOING: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REJECTED: "cancelled",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await getBookingsByUser(user.id);
      setBookings(res.data);
    } catch (err) {
      setError("Could not load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (err) {
      setError("Could not cancel booking.");
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-header">
        <h1>My Bookings</h1>
        <p>Welcome back, {user?.fullName}.</p>
      </div>

      {error && <p className="dashboard-status error">{error}</p>}
      {loading && <p className="dashboard-status">Loading your bookings...</p>}

      {!loading && bookings.length === 0 && (
        <p className="dashboard-status">
          You haven't booked a car yet. Head over to Browse Cars to get started.
        </p>
      )}

      <div className="booking-list">
        {bookings.map((b) => (
          <div className="booking-item" key={b.id}>
            <img
              src={b.car?.imageUrl || "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80"}
              alt={`${b.car?.brand} ${b.car?.model}`}
            />
            <div className="booking-item-details">
              <h3>{b.car?.brand} {b.car?.model}</h3>
              <p>{b.startDate} → {b.endDate}</p>
              <p className="booking-item-total">Total: {formatLKR(b.totalPrice)}</p>
            </div>
            <div className="booking-item-actions">
              <span className={`booking-status ${statusColors[b.status] || ""}`}>{b.status}</span>
              {(b.status === "CONFIRMED" || b.status === "PENDING") && (
                <button onClick={() => handleCancel(b.id)}>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
