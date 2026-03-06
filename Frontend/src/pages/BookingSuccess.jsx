import { makePayment, downloadTicket } from "../utils/paymentAndTicket";

export default function BookingSuccess() {

  const booking = {

    temple: "Badrinath Temple",
    date: "15 March 2026",
    slot: "10:00 AM - 11:00 AM",
    amount: 200

  };


  const handlePayment = () => {

    makePayment(booking, () => {

      // payment success callback

      downloadTicket(booking);

    });

  };


  return (

    <div style={{ textAlign:"center", marginTop:"60px" }}>

      <h2>Confirm Your Darshan Booking</h2>

      <button onClick={handlePayment} style={{ padding:"12px 20px" }}>

        Pay ₹200

      </button>

    </div>

  );

}