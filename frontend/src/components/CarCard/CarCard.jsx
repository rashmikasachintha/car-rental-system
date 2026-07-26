import React, { useState } from "react";
import { formatLKR } from "../../utils/currency";
import { getBookedDatesForCar } from "../../services/api";
import "./CarCard.css";

const CarCard = ({ car, onBook }) => {
  const isBookable = car.status !== "UNDER_MAINTENANCE";
  const [showDates, setShowDates] = useState(false);
  const [bookedRanges, setBookedRanges] = useState(null);
  const [loadingDates, setLoadingDates] = useState(false);

  const toggleBookedDates = async () => {
    if (showDates) {
      setShowDates(false);
      return;
    }
    setShowDates(true);
    if (bookedRanges === null) {
      setLoadingDates(true);
      try {
        const res = await getBookedDatesForCar(car.id);
        setBookedRanges(res.data);
      } catch (err) {
        setBookedRanges([]);
      } finally {
        setLoadingDates(false);
      }
    }
  };

  return (
    <div className="car-card">
      <img
        src={car.imageUrl || "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80"}
        alt={`${car.brand} ${car.model}`}
        className="car-card-image"
      />
      <div className="car-card-body">
        <div className="car-card-header">
          <h3>{car.brand} {car.model}</h3>
          <span className={`car-status ${isBookable ? "available" : "unavailable"}`}>
            {isBookable ? "AVAILABLE" : "UNDER MAINTENANCE"}
          </span>
        </div>
        <p className="car-meta">{car.year} • {car.category} • {car.transmission} • {car.seats} seats</p>
        {car.contactNumber && <p className="car-contact">📞 {car.contactNumber}</p>}

        <button className="car-dates-toggle" onClick={toggleBookedDates}>
          {showDates ? "Hide booked dates" : "View booked dates"}
        </button>

        {showDates && (
          <div className="car-dates-list">
            {loadingDates && <p>Loading...</p>}
            {!loadingDates && bookedRanges?.length === 0 && <p>No upcoming bookings — fully open.</p>}
            {!loadingDates &&
              bookedRanges?.map((range, i) => (
                <div key={i} className="car-date-range">
                  {range.startDate} → {range.endDate}
                </div>
              ))}
          </div>
        )}

        <div className="car-card-footer">
          <span className="car-price">{formatLKR(car.pricePerDay)}<small>/day</small></span>
          <button disabled={!isBookable} onClick={() => onBook(car)}>
            {isBookable ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
