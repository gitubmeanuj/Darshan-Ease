import { useEffect, useState } from "react";
import { getTemples } from "../services/templeService";
import TempleCard from "../components/TempleCard";

export default function Temples() {
  const [temples, setTemples] = useState([]);

  useEffect(() => {
    getTemples()
      .then(res => setTemples(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Available Temples</h2>
      {temples.map(temple => (
        <TempleCard key={temple.id} temple={temple} />
      ))}
    </div>
  );
}