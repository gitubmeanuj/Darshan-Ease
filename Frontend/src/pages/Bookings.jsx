import { useEffect, useState, useContext } from "react";
import { getUserBookings, cancelBooking } from "../services/bookingService";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const styles = `
  .bookings-container { padding: 40px 20px; max-width: 1000px; margin: 0 auto; }
  .bookings-header { margin-bottom: 30px; }
  .bookings-header h2 { font-size: 28px; color: #c97a20; margin-bottom: 10px; }
  .booking-card { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .booking-info { margin-bottom: 15px; }
  .booking-info p { margin: 8px 0; color: #333; }
  .booking-info strong { color: #c97a20; }
  .booking-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px; }
  .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: 0.2s; }
  .btn-primary { background: #ff9800; color: white; }
  .btn-primary:hover { background: #f57c00; }
  .btn-secondary { background: #2196F3; color: white; }
  .btn-secondary:hover { background: #1976D2; }
  .btn-danger { background: #f44336; color: white; }
  .btn-danger:hover { background: #da190b; }
  .btn-danger:disabled { background: #ccc; cursor: not-allowed; }
  .loading-center { display: flex; justify-content: center; align-items: center; min-height: 200px; }
  .empty-state { text-align: center; padding: 60px 20px; }
  .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
  .status-confirmed { background: #e8f5e9; color: #2e7d32; }
  .status-pending { background: #fff3e0; color: #e65100; }
`;

export default function Bookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getUserBookings();
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    try {
      setCancelLoading(true);
      await cancelBooking(selectedBooking._id);
      toast.success("Booking cancelled successfully");
      setBookings(prev => prev.filter(b => b._id !== selectedBooking._id));
      setCancelDialog(false);
      setSelectedBooking(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to cancel booking";
      toast.error(msg);
    } finally {
      setCancelLoading(false);
    }
  };

  const downloadTicket = (booking) => {
    const doc = new jsPDF();
    const slot = booking.slotId;

    doc.setFontSize(24);
    doc.setTextColor(201, 122, 32);
    doc.text("🛕 DARSHAN TICKET", 105, 20, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setLineWidth(0.5);
    doc.line(20, 28, 190, 28);

    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text("BOOKING CONFIRMATION", 20, 40);

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Devotee: ${user?.name || "Guest"}`, 20, 52);
    doc.text(`Booking ID: ${booking._id?.substring(0, 12)}...`, 20, 61);
    
    doc.setFontSize(13);
    doc.setTextColor(201, 122, 32);
    doc.text("TEMPLE DETAILS", 20, 75);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Temple: ${slot?.templeId?.templeName || "N/A"}`, 20, 85);
    doc.text(`Location: ${slot?.templeId?.location || "N/A"}`, 20, 94);

    doc.setFontSize(13);
    doc.setTextColor(201, 122, 32);
    doc.text("SLOT INFORMATION", 20, 110);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${slot?.date || "N/A"}`, 20, 120);
    doc.text(`Time: ${slot?.startTime} - ${slot?.endTime}`, 20, 129);
    doc.text(`Number of Persons: ${booking.numberOfPeople}`, 20, 138);
    doc.text(`Per Person Price: ₹ ${slot?.price || 0}`, 20, 147);
    
    doc.setFontSize(12);
    doc.setTextColor(201, 122, 32);
    doc.text(`TOTAL: ₹ ${(slot?.price || 0) * booking.numberOfPeople}`, 20, 160);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.line(20, 168, 190, 168);
    doc.text("IMPORTANT INSTRUCTIONS", 20, 176);
    doc.setFontSize(9);
    doc.text("• Please arrive 15 minutes before the slot start time", 20, 183);
    doc.text("• Bring a valid ID proof for verification", 25, 190);
    doc.text("• Keep this ticket for entry to the temple", 25, 197);
    doc.text("• No refund once the slot time has started", 25, 204);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by DarshanEase | www.darshanease.com", 105, 270, { align: "center" });

    doc.save(`darshan_ticket_${booking._id?.substring(0, 8)}.pdf`);
  };

  if (loading) {
    return (
      <div className="loading-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="bookings-container">
        <div className="bookings-header">
          <h2>🛕 My Bookings</h2>
          <p style={{ color: "#666" }}>Welcome, {user?.name}!</p>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <h3 style={{ color: "#666" }}>No bookings yet</h3>
            <p style={{ color: "#999" }}>Start your spiritual journey by booking a darshan slot.</p>
            <Button 
              variant="contained"
              style={{ background: "#ff9800", marginTop: "20px" }}
              href="/temples"
            >
              Browse Temples
            </Button>
          </div>
        ) : (
          bookings.map((booking) => {
            const slot = booking.slotId;
            const totalAmount = (slot?.price || 0) * booking.numberOfPeople;

            return (
              <div key={booking._id} className="booking-card">
                <div className="booking-info">
                  <p>
                    <strong>🛕 Temple:</strong> {slot?.templeId?.templeName || "N/A"}
                  </p>
                  <p>
                    <strong>📍 Location:</strong> {slot?.templeId?.location || "N/A"}
                  </p>
                  <p>
                    <strong>📅 Date:</strong> {slot?.date || "N/A"}
                  </p>
                  <p>
                    <strong>⏰ Time:</strong> {slot?.startTime} - {slot?.endTime}
                  </p>
                  <p>
                    <strong>👥 Number of People:</strong> {booking.numberOfPeople}
                  </p>
                  <p>
                    <strong>💰 Total Amount:</strong> ₹ {totalAmount}
                  </p>
                  <p>
                    <strong>Booking ID:</strong> {booking._id}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="status-badge status-confirmed">Confirmed</span>
                  </p>
                </div>

                <div className="booking-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => downloadTicket(booking)}
                  >
                    📥 Download Ticket
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelClick(booking)}
                  >
                    ❌ Cancel Booking
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle>Cancel Booking?</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to cancel this booking?</p>
          {selectedBooking && (
            <p>
              <strong>{selectedBooking.slotId?.templeId?.templeName}</strong> on{" "}
              <strong>{selectedBooking.slotId?.date}</strong>
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>No, Keep It</Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            disabled={cancelLoading}
          >
            {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}