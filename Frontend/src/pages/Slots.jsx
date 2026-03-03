import { createBooking } from "../services/bookingService";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { useState } from "react";

export default function Slots() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [open, setOpen] = useState(false);

  const handleBooking = async () => {
    await createBooking({
      slotId: selectedSlot.id
    });
    setOpen(false);
    alert("Booking Successful!");
  };

  return (
    <>
      {slots.map(slot => (
        <div key={slot.id}>
          <p>{slot.date}</p>
          <button onClick={() => {
            setSelectedSlot(slot);
            setOpen(true);
          }}>
            Book Now
          </button>
        </div>
      ))}

      <Dialog open={open}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          Are you sure you want to book this slot?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleBooking} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}