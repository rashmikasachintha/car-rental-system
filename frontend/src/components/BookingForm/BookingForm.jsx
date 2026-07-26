import React, { useEffect, useState } from "react";
import { createBooking, getBookedDatesForCar } from "../../services/api";
import { formatLKR } from "../../utils/currency";
import "./BookingForm.css";

const BookingForm = ({ car, onClose, onSuccess }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getBookedDatesForCar(car.id);
        setBookedRanges(res.data);
      } catch (err) {
        setBookedRanges([]);
      } finally {
        setLoadingDates(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days =
    startDate && endDate
      ? Math.max(0, (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      : 0;
  const estimatedTotal = (days * Number(car.pricePerDay)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please log in to book a car.");
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        userId: user.id,
        carId: car.id,
        startDate,
        endDate,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Book {car.brand} {car.model}</h2>
        <p className="booking-subtitle">{formatLKR(car.pricePerDay)} / day</p>

        {!loadingDates && bookedRanges.length > 0 && (
          <div className="already-booked-box">
            <p className="already-booked-title">Already booked on these dates:</p>
            {bookedRanges.map((range, i) => (
              <div key={i} className="already-booked-range">
                {range.startDate} → {range.endDate}
              </div>
            ))}
          </div>
        )}

        {error && <div className="booking-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            min={startDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          {days > 0 && (
            <p className="booking-total">
              {days} day(s) — Estimated total: <strong>{formatLKR(estimatedTotal)}</strong>
            </p>
          )}

          <div className="booking-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Request Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
