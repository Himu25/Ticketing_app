"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import OrderStatus from "./OrderStatus";
import CancelOrderButton from "./CancelOrderButton";

export default function Order({ order }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (order.status !== "created") return;

    const updateTimer = () => {
      const secondsLeft = Math.floor(
        (new Date(order.expiresAt) - new Date()) / 1000
      );
      setTimeLeft(Math.max(secondsLeft, 0));
      if (secondsLeft <= 0) router.refresh();
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [order.status, order.expiresAt]);

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      const { error, token } = await stripe.createToken(
        elements.getElement(CardElement)
      );
      if (error) throw new Error(error.message);

      const res = await fetch("/api/payments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.id, orderId: order.id }),
      });

      if (!res.ok) throw new Error("Payment failed");

      toast.success("Payment successful!");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <motion.div
        className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Order Details
        </h1>
        <div className="space-y-4 mb-6">
          <p className="text-gray-600">
            <strong>Ticket:</strong> {order.ticket.title}
          </p>
          <p className="text-gray-600">
            <strong>Price:</strong> ${order.ticket.price}
          </p>
          <OrderStatus
            status={order.status}
            expiresAt={order.expiresAt}
            timeLeft={timeLeft}
          />
        </div>
        {order.status === "created" && timeLeft > 0 && (
          <button
            onClick={() => setOpen(true)}
            className="w-full py-3 mt-2 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 shadow-md"
          >
            Proceed to Payment
          </button>
        )}
        {order.status === "created" && <CancelOrderButton orderId={order.id} />}
      </motion.div>

      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center mb-6">
              Enter Payment Details
            </h2>
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <CardElement
                  options={{ hidePostalCode: true }}
                  className="border p-2 rounded-md"
                />
              </div>
              <button
                type="submit"
                disabled={processing}
                className={`w-full py-3 rounded-lg font-medium text-white ${
                  processing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {processing ? "Processing..." : "Pay Now"}
              </button>
            </form>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 text-center text-indigo-600 font-medium"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
