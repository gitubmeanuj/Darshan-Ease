import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSlots, getTempleById } from "../services/templeService";
import { createBooking } from "../services/bookingService";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from "@mui/material";
import toast from "react-hot-toast";

const styles = `
  .slots-container { padding: 40px 20px; max-width: 1200px; margin: 0 auto; }
  .temple-header { text-align: center; margin-bottom: 40px; }
  .temple-header h1 { font-size: 32px; color: #c97a20; margin-bottom: 10px; }
  .temple-header p { color: #666; font-size: 16px; }
  .slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .slot-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s; }
  .slot-card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
  .slot-time { font-size: 18px; font-weight: bold; color: #c97a20; margin-bottom: 10px; }
  .slot-date { color: #666; margin-bottom: 8px; }
  .slot-seats { color: #666; margin-bottom: 8px; }
  .slot-price { font-size: 16px; color: #27ae60; font-weight: bold; margin-bottom: 12px; }
  .slot-button { width: 100%; padding: 10px; background-color: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
  .slot-button:hover { background-color: #f57c00; }
  .slot-button:disabled { background-color: #ccc; cursor: not-allowed; }
  .loading-center { display: flex; justify-content: center; align-items: center; min-height: 400px; }
  .empty-state { text-align: center; padding: 60px 20px; color: #666; }
`;

export default function Slots() {
  const { id: templeId } = useParams();
  const navigate = useNavigate();
  
  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [open, setOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch temple details
        const templeRes = await getTempleById(templeId);
        setTemple(templeRes.data.data);
        
        // Fetch slots for this temple
        const slotsRes = await getSlots(templeId);
        setSlots(slotsRes.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setError("Failed to load slots. Please try again.");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    if (templeId) {
      fetchData();
    }
  }, [templeId]);

  const handleBookingClick = (slot) => {
    setSelectedSlot(slot);
    setNumberOfPeople(1);
    setOpen(true);
  };

  const handleBooking = async () => {
    if (!selectedSlot || numberOfPeople < 1) {
      toast.error("Please enter valid number of people");
      return;
    }

    try {
      setBookingLoading(true);
      await createBooking({
        slotId: selectedSlot._id,
        numberOfPeople: parseInt(numberOfPeople)
      });
      
      toast.success("Booking successful! Check your bookings.");
      setOpen(false);
      setSelectedSlot(null);
      
      // Refresh slots to show updated availability
      const slotsRes = await getSlots(templeId);
      setSlots(slotsRes.data.data || []);
      
      setTimeout(() => navigate("/bookings"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed";
      toast.error(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="slots-container">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="empty-state">
        <h2>🛕 No Slots Available</h2>
        <p>This temple has no available slots at the moment.</p>
        <Button 
          onClick={() => navigate("/temples")}
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          Back to Temples
        </Button>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="slots-container">
        {temple && (
          <div className="temple-header">
            <h1>{temple.templeName}</h1>
            <p>📍 {temple.location}</p>
            <p>Open: {temple.darshanStartTime} - {temple.darshanEndTime}</p>
          </div>
        )}

        <div className="slots-grid">
          {slots.map((slot) => (
            <div key={slot._id} className="slot-card">
              <div className="slot-time">
                {slot.startTime} - {slot.endTime}
              </div>
              <div className="slot-date">📅 {slot.date}</div>
              <div className="slot-seats">
                👥 Available: {slot.availableSeats} seats
              </div>
              <div className="slot-price">₹ {slot.price}</div>
              <button
                className="slot-button"
                onClick={() => handleBookingClick(slot)}
                disabled={slot.availableSeats === 0}
              >
                {slot.availableSeats === 0 ? "Sold Out" : "Book Now"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          {selectedSlot && (
            <div style={{ paddingTop: "20px" }}>
              <p><strong>Date:</strong> {selectedSlot.date}</p>
              <p><strong>Time:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}</p>
              <p><strong>Price per person:</strong> ₹{selectedSlot.price}</p>
              
              <TextField
                label="Number of People"
                type="number"
                inputProps={{ min: "1", max: selectedSlot.availableSeats }}
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                fullWidth
                margin="normal"
              />
              
              <p style={{ marginTop: "12px", color: "#c97a20", fontWeight: "bold" }}>
                Total: ₹{selectedSlot.price * numberOfPeople}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBooking}
            variant="contained"
            color="primary"
            disabled={bookingLoading}
          >
            {bookingLoading ? <CircularProgress size={24} /> : "Confirm Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}