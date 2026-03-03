import { useEffect, useState, useContext } from "react";
import { getUserBookings, cancelBooking } from "../services/bookingService";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Bookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getUserBookings(user.id)
      .then(res => setBookings(res.data))
      .catch(err => console.log(err));
  }, [user.id]);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      toast.success("Booking Cancelled");

      // remove cancelled booking from UI instantly
      setBookings(prev =>
        prev.filter(b => b.id !== id)
      );
    } catch (error) {
      toast.error("Cancellation Failed");
    }
  };

  return (
    <div>
      <h2>My Bookings</h2>

      {bookings.map((b) => (
        <div key={b.id} style={{ marginBottom: "15px" }}>
          <p>Date: {b.bookingDate}</p>
          <p>Amount: ₹ {b.totalAmount}</p>

          <button onClick={() => handleCancel(b.id)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}