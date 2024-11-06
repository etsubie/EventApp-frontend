import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "flowbite-react";
import { fetchEventapi } from "../api/events";

const stripePromise = loadStripe(
  "pk_test_51QC0xjP70QwNGlw2r54IRSDdW0M3yh1Zn8RubgxQR5cPMhjmDLhRqVNHNhoTUyBzYy1tZ23DtxMMslol4aas7RYL00k2L2Znlu"
);

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchEventapi(id);
        setEvent(data);
      } catch (error) {
        setError("Error fetching event details.");
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
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
      const { error: paymentError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (paymentError) {
        setError(paymentError.message);
        setLoading(false);
        return;
      }

      // Confirm booking
      const response = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event_id: id }),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentSuccess(data.message);
        setError(null); // Clear any previous errors
        setTimeout(() => navigate(-1), 3000); // Redirect after a few seconds
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Booking failed.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full h-full justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="rounded h-72 p-5 w-96 space-y-4 bg-white shadow-xl"
      >
        <h2 className="font-bold text-xl text-center text-gray-800">Complete Payment for</h2>
        <h1 className="font-bold text-blue-900">{event.title}</h1>
        <p className="text-xl font-bold text-blue-800"> ${event.ticket_price}</p>
        <CardElement />
        <Button type="submit" disabled={!stripe || loading} className="w-full bg-blue-900 mt-10">
          {loading ? "Processing..." : "Pay"}
        </Button>
      </form>

      {paymentSuccess && (
        <div className="text-green-600 font-semibold">
           {paymentSuccess}
        </div>
      )}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
    </div>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default Payment;
