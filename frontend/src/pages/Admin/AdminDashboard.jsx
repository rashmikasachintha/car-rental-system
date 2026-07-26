import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import {
  getAllCars,
  addCar,
  updateCar,
  deleteCar,
  getAllBookings,
  approveBooking,
  rejectBooking,
} from "../../services/api";
import { formatLKR } from "../../utils/currency";
import "./AdminDashboard.css";

const EMPTY_FORM = {
  brand: "",
  model: "",
  year: "",
  category: "Sedan",
  pricePerDay: "",
  imageUrl: "",
  transmission: "Automatic",
  seats: "",
  contactNumber: "",
  status: "AVAILABLE",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [tab, setTab] = useState("cars");
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedCarId, setExpandedCarId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [carsRes, bookingsRes] = await Promise.all([getAllCars(), getAllBookings()]);
      setCars(carsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      setError(
        err.response?.status === 403
          ? "You don't have permission to view this — admin access required."
          : "Could not load admin data. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (car) => {
    setForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      category: car.category,
      pricePerDay: car.pricePerDay,
      imageUrl: car.imageUrl || "",
      transmission: car.transmission || "",
      seats: car.seats,
      contactNumber: car.contactNumber || "",
      status: car.status,
    });
    setEditingId(car.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        seats: Number(form.seats),
        pricePerDay: Number(form.pricePerDay),
      };

      if (editingId) {
        await updateCar(editingId, payload);
        setSuccessMsg("Car updated successfully.");
      } else {
        await addCar(payload);
        setSuccessMsg("Car added successfully.");
      }

      resetForm();
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save car.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car? This cannot be undone.")) return;
    try {
      await deleteCar(id);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete car.");
    }
  };

  const handleApprove = async (id) => {
    setError("");
    try {
      await approveBooking(id);
      setSuccessMsg("Booking approved.");
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not approve booking.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this booking request?")) return;
    setError("");
    try {
      await rejectBooking(id);
      setSuccessMsg("Booking rejected.");
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reject booking.");
    }
  };

  if (!user || user.role !== "ADMIN") return null;

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div className="admin-page">
      <Navbar />

      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage the fleet and review all bookings.</p>
      </div>

      {successMsg && <div className="admin-success">{successMsg}</div>}
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-tabs">
        <button className={tab === "cars" ? "active" : ""} onClick={() => setTab("cars")}>
          Manage Cars
        </button>
        <button className={tab === "bookings" ? "active" : ""} onClick={() => setTab("bookings")}>
          All Bookings {pendingCount > 0 && <span className="pending-badge">{pendingCount}</span>}
        </button>
      </div>

      {loading && <p className="admin-status">Loading...</p>}

      {!loading && tab === "cars" && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Fleet ({cars.length})</h2>
            <button
              className="btn-add"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              + Add Car
            </button>
          </div>

          {showForm && (
            <form className="car-form" onSubmit={handleSubmit}>
              <div className="car-form-grid">
                <div>
                  <label>Brand</label>
                  <input name="brand" value={form.brand} onChange={handleChange} required />
                </div>
                <div>
                  <label>Model</label>
                  <input name="model" value={form.model} onChange={handleChange} required />
                </div>
                <div>
                  <label>Year</label>
                  <input type="number" name="year" value={form.year} onChange={handleChange} required />
                </div>
                <div>
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Hatchback</option>
                    <option>Luxury</option>
                    <option>Van</option>
                  </select>
                </div>
                <div>
                  <label>Price / Day (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="pricePerDay"
                    value={form.pricePerDay}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Seats</label>
                  <input type="number" name="seats" value={form.seats} onChange={handleChange} required />
                </div>
                <div>
                  <label>Transmission</label>
                  <select name="transmission" value={form.transmission} onChange={handleChange}>
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>
                <div>
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                  </select>
                </div>
                <div>
                  <label>Contact Number</label>
                  <input
                    name="contactNumber"
                    placeholder="e.g. 0774444444"
                    value={form.contactNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="car-form-wide">
                  <label>Image URL</label>
                  <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
                </div>
              </div>

              <div className="car-form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? "Update Car" : "Add Car"}
                </button>
              </div>
            </form>
          )}

          <table className="admin-table">
            <thead>
              <tr>
                <th>Brand / Model</th>
                <th>Year</th>
                <th>Category</th>
                <th>Price/Day</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Bookings</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => {
                const carBookings = bookings.filter(
                  (b) => b.car?.id === car.id && ["PENDING", "CONFIRMED", "ONGOING"].includes(b.status)
                );
                const isExpanded = expandedCarId === car.id;

                return (
                  <React.Fragment key={car.id}>
                    <tr>
                      <td>{car.brand} {car.model}</td>
                      <td>{car.year}</td>
                      <td>{car.category}</td>
                      <td>{formatLKR(car.pricePerDay)}</td>
                      <td>{car.contactNumber || "—"}</td>
                      <td><span className={`status-pill ${car.status.toLowerCase()}`}>{car.status}</span></td>
                      <td>
                        <button
                          className="btn-link"
                          onClick={() => setExpandedCarId(isExpanded ? null : car.id)}
                        >
                          {carBookings.length} active {isExpanded ? "▲" : "▼"}
                        </button>
                      </td>
                      <td className="admin-table-actions">
                        <button onClick={() => handleEdit(car)}>Edit</button>
                        <button className="btn-danger" onClick={() => handleDelete(car.id)}>Delete</button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="car-bookings-row">
                        <td colSpan={8}>
                          {carBookings.length === 0 ? (
                            <p className="no-bookings-msg">No active bookings for this car.</p>
                          ) : (
                            <table className="mini-table">
                              <thead>
                                <tr>
                                  <th>Customer</th>
                                  <th>Contact</th>
                                  <th>Dates</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {carBookings.map((b) => (
                                  <tr key={b.id}>
                                    <td>{b.userFullName}</td>
                                    <td>{b.userPhoneNumber || "—"}</td>
                                    <td>{b.startDate} → {b.endDate}</td>
                                    <td><span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === "bookings" && (
        <div className="admin-section">
          <h2>All Bookings ({bookings.length})</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Car</th>
                <th>Dates</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.userFullName}</td>
                  <td>
                    <div>{b.userPhoneNumber || "No phone on file"}</div>
                    <div className="booking-email">{b.userEmail}</div>
                  </td>
                  <td>{b.car?.brand} {b.car?.model}</td>
                  <td>{b.startDate} → {b.endDate}</td>
                  <td>{formatLKR(b.totalPrice)}</td>
                  <td><span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span></td>
                  <td className="admin-table-actions">
                    {b.status === "PENDING" && (
                      <>
                        <button className="btn-approve" onClick={() => handleApprove(b.id)}>Approve</button>
                        <button className="btn-danger" onClick={() => handleReject(b.id)}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
