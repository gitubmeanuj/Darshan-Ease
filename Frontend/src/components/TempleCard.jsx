import { Link } from "react-router-dom";
import "./TempleCard.css";

export default function TempleCard({ temple }) {

  return (

    <div className="temple-card">

      <img
        src={temple.image}
        alt={temple.templeName}
        className="temple-img"
      />

      <div className="temple-overlay">

        <div className="temple-glass">

          <h3>{temple.templeName}</h3>

          <p>📍 {temple.location}</p>

          <Link
            to={`/temples/${temple.id}/slots`}
            className="view-slots"
          >
            Book Darshan
          </Link>

        </div>

      </div>

    </div>

  );
}