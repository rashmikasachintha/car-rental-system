import React, { useEffect, useState, useCallback } from "react";
import "./ImageSlider.css";

/**
 * Reusable auto-rotating image slider.
 * Pass an array of { src, caption } objects via the `slides` prop.
 */
const ImageSlider = ({ slides, intervalMs = 4000 }) => {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index) => {
      const total = slides.length;
      setCurrent((index + total) % total);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    const timer = setInterval(next, intervalMs);
    return () => clearInterval(timer);
  }, [next, intervalMs]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="image-slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.src})` }}
        >
          <div className="slide-overlay" />
          {slide.caption && <p className="slide-caption">{slide.caption}</p>}
        </div>
      ))}

      <button className="slider-arrow left" onClick={prev} aria-label="Previous slide">
        ‹
      </button>
      <button className="slider-arrow right" onClick={next} aria-label="Next slide">
        ›
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
