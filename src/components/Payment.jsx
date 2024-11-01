import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "flowbite-react";
import { fetchEventapi } from "../api/events";
import { useToast } from "../Context/TostContext";

const stripePromise = loadStripe(
  "pk_test_51QC0xjP70QwNGlw2r54IRSDdW0M3yh1Zn8RubgxQR5cPMhjmDLhRqVNHNhoTUyBzYy1tZ23DtxMMslol4aas7RYL00k2L2Znlu"
);

const PaymentForm = () => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const elements = useElements();
  const [event, setEvent] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const {addToast} = useToast()
const navigte = useNavigate()
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await fetchEventapi(id); 
        setEvent(data); 
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
  
    try {
      setLoading(true); 
      const { error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
  
      if (error) {
        setError(error.message);
        setLoading(false); 
        return;
      }
  
      // Confirm booking
      const response = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ event_id: id }),
      });
  
      if (response.ok) {
        const data = await response.json();
        navigte(-1)

        addToast(`Payment successful and booking confirmed! You will receive an email.`, "success");
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Booking failed.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Reset loading in the finally block to ensure it's executed
    }
  };
  
  return (
    <div className="flex flex-col space-y-4  w-full h-full justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className=" rounded h-72 p-5 w-96 space-y-4 bg-white shadow-xl"
      >
        <h2 className="font-bold text-xl text-center">Complete Payment for</h2>
        <h1 className="font-bold "> {event.title}</h1>
        <p>Price: ${event.ticket_price}</p>
        <CardElement />
        <Button type="submit" disabled={!stripe} className="w-full bg-blue-900 ">
          {loading ? "Processing..." : "Pay"} 
        </Button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {paymentSuccess && <div style={{ color: "green" }}>{paymentSuccess}</div>}
    </div>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default Payment;
