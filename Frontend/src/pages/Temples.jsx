import { useEffect, useState } from "react";
import { getTemples } from "../services/templeService";
import { getTempleImageUrl } from "../utils/templeImageMap";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .temples-page { min-height: 100vh; font-family: 'Lato', sans-serif; background: #fdf6ee; }
  .temple-hero { text-align: center; padding: 90px 20px 60px; background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,160,30,0.18), transparent), linear-gradient(180deg,#fff8ee,#fdf6ee); }
  .hero-badge { display: inline-block; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #c97a20; border: 1px solid #f0c07a; padding: 5px 16px; border-radius: 20px; margin-bottom: 24px; background: rgba(255,200,100,0.12); }
  .temple-hero h1 { font-family: 'Cinzel', serif; font-size: clamp(30px,5vw,52px); font-weight: 700; background: linear-gradient(135deg,#b05000,#e07810,#f5a623); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2; margin-bottom: 16px; }
  .temple-hero p { color: #8a6030; font-size: 17px; font-weight: 300; max-width: 480px; margin: 0 auto 32px; line-height: 1.6; }
  .temple-search { padding: 13px 20px 13px 20px; width: 340px; max-width: 90vw; border-radius: 30px; border: 1.5px solid #f0c07a; background: #fff; font-size: 15px; color: #5a3a10; outline: none; box-shadow: 0 4px 18px rgba(200,130,0,0.08); }
  .temple-search:focus { border-color: #e07810; box-shadow: 0 4px 22px rgba(200,130,0,0.18); }
  .temple-search::placeholder { color: #c8a060; }
  .stats-bar { display: flex; justify-content: center; gap: 50px; padding: 28px 20px; background: linear-gradient(90deg,rgba(255,200,80,0.1),rgba(255,140,0,0.1)); border-top: 1px solid #f5dea0; border-bottom: 1px solid #f5dea0; margin: 20px 0; flex-wrap: wrap; }
  .stat { text-align: center; }
  .stat-num { font-family: 'Cinzel', serif; font-size: 26px; color: #c97a20; font-weight: 700; }
  .stat-label { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #9a7040; margin-top: 3px; }
  .temple-categories { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 30px 20px; }
  .cat-btn { padding: 8px 22px; border-radius: 22px; border: 1.5px solid #f0c07a; background: transparent; color: #a06020; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .25s; }
  .cat-btn.active { background: linear-gradient(135deg,#e07810,#f5a623); border-color: transparent; color: white; box-shadow: 0 4px 16px rgba(220,120,0,0.35); }
  .temples-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 30px; padding: 40px 6%; max-width: 1400px; margin: 0 auto; }
  .temple-card { position: relative; border-radius: 20px; overflow: hidden; cursor: pointer; transition: transform .4s, box-shadow .4s; box-shadow: 0 6px 24px rgba(160,80,0,0.12); }
  .temple-card:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(160,80,0,0.22); }
  .temple-img-placeholder { width: 100%; height: 260px; display: flex; align-items: center; justify-content: center; font-size: 72px; background: linear-gradient(135deg,#f5d080,#f0a040); }
  .image-placeholder { width: 100%; height: 260px; display: flex; align-items: center; justify-content: center; font-size: 72px; background: linear-gradient(135deg,#f5d080,#f0a040); }
  .temple-img { width: 100%; height: 260px; object-fit: cover; transition: transform 0.6s ease; }
  .temple-card:hover .temple-img { transform: scale(1.08); }
  .temple-overlay { position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 20px; background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 50%, transparent 100%); }
  .temple-glass { width: 100%; backdrop-filter: blur(10px); background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.28); border-radius: 14px; padding: 16px 18px; color: white; text-align: center; }
  .temple-glass h3 { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; margin-bottom: 4px; }
  .temple-glass p { font-size: 13px; opacity: .85; margin-bottom: 14px; }
  .view-slots { display: inline-block; padding: 9px 22px; border-radius: 22px; background: linear-gradient(135deg,#ff6a00,#ff9800); color: white; font-size: 13px; font-weight: 600; text-decoration: none; }
  .empty-state { text-align: center; padding: 80px 20px; color: #b08040; }
  .empty-icon { font-size: 56px; margin-bottom: 16px; }
  .empty-state h3 { font-family: 'Cinzel', serif; font-size: 22px; margin-bottom: 8px; }
  .loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 30px; padding: 40px 6%; max-width: 1400px; margin: 0 auto; }
  .skeleton-card { border-radius: 20px; overflow: hidden; background: #f0e8d8; animation: pulse 1.6s ease-in-out infinite; }
  .skeleton-img { height: 260px; background: #e8d8c0; }
  .skeleton-body { padding: 20px; }
  .skeleton-line { height: 14px; border-radius: 7px; background: #e0c8a0; margin-bottom: 10px; }
  .skeleton-line.short { width: 60%; }
  .skeleton-btn { height: 36px; border-radius: 18px; background: #e0c8a0; margin-top: 8px; width: 50%; margin-left: 25%; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
`;

const DEMO_TEMPLES = [
  { id: 1, templeName: "Badrinath",       location: "Uttarakhand",     category: "Famous Temples", emoji: "🏔️" },
  { id: 2, templeName: "Rameswaram",      location: "Tamil Nadu",      category: "Jyotirlinga",    emoji: "🌊" },
  { id: 3, templeName: "Vrindavan",       location: "Uttar Pradesh",   category: "Famous Temples", emoji: "🪷" },
  { id: 4, templeName: "Somnath",         location: "Gujarat",         category: "Jyotirlinga",    emoji: "🌅" },
  { id: 5, templeName: "Vaishno Devi",    location: "Jammu & Kashmir", category: "Shakti Peeth",   emoji: "⛰️" },
  { id: 6, templeName: "Tirupati Balaji", location: "Andhra Pradesh",  category: "Famous Temples", emoji: "🙏" },
  { id: 7, templeName: "Kamakhya Devi",   location: "Assam",           category: "Shakti Peeth",   emoji: "🔱" },
  { id: 8, templeName: "Kedarnath",       location: "Uttarakhand",     category: "Jyotirlinga",    emoji: "❄️" },
];

const CATEGORIES = ["All", "Jyotirlinga", "Shakti Peeth", "Famous Temples"];

function TempleCard({ temple }) {
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
      <div className="image-placeholder" style={{ display: "none" }}>🛕</div>
      <div className="temple-overlay">
        <div className="temple-glass">
          <h3>{temple.templeName}</h3>
          <p>📍 {temple.location}</p>
          <a href={`/temples/${temple._id}/slots`} className="view-slots">
            Book Darshan
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Temples() {
  const [temples, setTemples]         = useState([]);
  const [search, setSearch]           = useState("");
  const [activeCategory, setCategory] = useState("All");
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    setLoading(true);
    getTemples()
      .then(res => {
        const templesToDisplay = res.data.data && Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setTemples(templesToDisplay);
      })
      .catch(() => {
        console.error("Failed to fetch temples");
        setTemples([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = temples.filter(t =>
    (t.templeName.toLowerCase().includes(search.toLowerCase()) ||
     t.location.toLowerCase().includes(search.toLowerCase())) &&
    (activeCategory === "All" || t.category === activeCategory)
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="temples-page">

        <div className="temple-hero">
          <div className="hero-badge">✦ Divine Destinations ✦</div>
          <h1>Explore Sacred Temples</h1>
          <p>Book darshan slots at India's most divine destinations with ease and reverence.</p>
          <input
            className="temple-search"
            placeholder="🔍  Search temple or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="stats-bar">
          {[["500+","Temples"],["2M+","Devotees"],["28","States"],["12","Jyotirlingas"]].map(([n,l]) => (
            <div key={l} className="stat">
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>

        <div className="temple-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-btn${activeCategory === cat ? " active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-grid">
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                  <div className="skeleton-btn" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛕</div>
            <h3>No temples found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="temples-grid">
            {filtered.map(t => <TempleCard key={t._id || t.id} temple={t} />)}
          </div>
        )}

      </div>
    </>
  );
}
