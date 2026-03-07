import { Link } from "react-router-dom";
import "./TempleCard.css";
import { getTempleImageUrl } from "../utils/templeImageMap";

export default function TempleCard({ temple }) {
  const imageUrl = getTempleImageUrl(temple);

  return (

    <div className="temple-card">

      <img
        src={imageUrl}
        alt={temple.templeName}
        className="temple-img"
        onError={(e) => {
          e.target.style.display = "none";
          e.currentTarget.nextElementSibling.style.display = "flex";
        }}
      />
      
      <div className="image-placeholder" style={{ display: "none" }}>
        🛕
      </div>

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