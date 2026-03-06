import jsPDF from "jspdf";


// PDF GENERATOR
export const downloadTicket = (booking) => {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("🛕 DarshanEase Temple Ticket", 20, 20);

  doc.setFontSize(12);

  doc.text(`Temple: ${booking.temple}`, 20, 40);
  doc.text(`Date: ${booking.date}`, 20, 50);
  doc.text(`Slot: ${booking.slot}`, 20, 60);
  doc.text(`Amount Paid: ₹${booking.amount}`, 20, 70);

  doc.text("Please arrive 30 minutes before darshan.", 20, 90);

  doc.save("darshan-ticket.pdf");

};



// RAZORPAY PAYMENT
export const makePayment = (booking, onSuccess) => {

  const options = {

    key: "rzp_test_123456789",

    amount: booking.amount * 100,

    currency: "INR",

    name: "DarshanEase",

    description: "Temple Darshan Booking",

    handler: function () {

      alert("Payment Successful 🙏");

      onSuccess();

    },

    theme: {
      color: "#ff6a00"
    }

  };

  const rzp = new window.Razorpay(options);

  rzp.open();

};