import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";
import templeImg1 from "../assets/images/temple1.jpg";
import badrinathImg from "../assets/images/Badrinath.jpg";
import rameswaramImg from "../assets/images/Rameswaram.jpg";
import vrindavanImg from "../assets/images/Vrindavan.jpg";

const SLIDESHOW_IMAGES = [
  { id: 1, src: templeImg1, alt: "Vaishno Devi Temple" },
  { id: 2, src: badrinathImg, alt: "Badrinath Temple" },
  { id: 3, src: rameswaramImg, alt: "Rameswaram Temple" },
  { id: 4, src: vrindavanImg, alt: "Vrindavan Temple" },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? SLIDESHOW_IMAGES.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="slideshow-container">
          {SLIDESHOW_IMAGES.map((image, index) => (
            <div
              key={image.id}
              className={`slide ${index === currentImageIndex ? "active" : ""}`}
            >
              <img src={image.src} alt={image.alt} className="slide-img" />
            </div>
          ))}

          <button className="slide-arrow prev-arrow" onClick={goToPrevious}>
            ❮
          </button>
          <button className="slide-arrow next-arrow" onClick={goToNext}>
            ❯
          </button>

          <div className="slide-indicators">
            {SLIDESHOW_IMAGES.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentImageIndex ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="hero-overlay">
          <h1 className="title">🛕 DarshanEase</h1>

          <p className="subtitle">
            DarshanEase allows devotees to conveniently book temple darshan slots
            online. Instead of waiting in long queues, users can select temples,
            choose available time slots, and confirm their darshan tickets in
            advance from anywhere.
          </p>

          <div className="button-group">
            <Link to="/login" className="btn primary">
              Login
            </Link>
            <Link to="/signup" className="btn secondary">
              Signup
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            🛕
            <h3>Book Darshan</h3>
            <p>Reserve temple darshan slots online easily.</p>
          </div>

          <div className="feature-card">
            📅
            <h3>Select Date</h3>
            <p>Choose preferred darshan date and timing.</p>
          </div>

          <div className="feature-card">
            🎫
            <h3>Manage Bookings</h3>
            <p>View and manage your previous bookings.</p>
          </div>

          <div className="feature-card">
            👤
            <h3>User Profile</h3>
            <p>Update personal information anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
}