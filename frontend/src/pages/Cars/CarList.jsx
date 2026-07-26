import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CarCard from "../../components/CarCard/CarCard";
import BookingForm from "../../components/BookingForm/BookingForm";
import { getAllCars } from "../../services/api";
import "./CarList.css";

const CATEGORIES = ["All", "Sedan", "SUV", "Hatchback", "Luxury", "Van"];

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCar, setSelectedCar] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchCars = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllCars();
      setCars(res.data);
    } catch (err) {
      setError("Could not load cars. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const filteredCars =
    category === "All"
      ? cars
      : cars.filter((c) => c.category?.toLowerCase() === category.toLowerCase());

  const handleBookingSuccess = () => {
    setSelectedCar(null);
    setSuccessMsg("Booking request submitted! It's pending admin approval — check My Bookings for status.");
    fetchCars();
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="carlist-page">
      <Navbar />

      <div className="carlist-header">
        <h1>Browse Our Fleet</h1>
        <p>Find the perfect car for your next trip.</p>
      </div>

      {successMsg && <div className="carlist-success">{successMsg}</div>}

      <div className="carlist-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="carlist-status">Loading cars...</p>}
      {error && <p className="carlist-status error">{error}</p>}

      {!loading && !error && filteredCars.length === 0 && (
        <p className="carlist-status">No cars found in this category.</p>
      )}

      <div className="carlist-grid">
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} onBook={setSelectedCar} />
        ))}
      </div>

      {selectedCar && (
        <BookingForm
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default CarList;
