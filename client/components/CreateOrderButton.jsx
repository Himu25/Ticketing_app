"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useRequest from "@/Hooks/useRequest";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateOrderButton({ ticket }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { doRequest, loading } = useRequest({
    url: "/api/orders/",
    method: "post",
    body: { ticketID: ticket.id },
    onSuccess: (order) => router.push(`/orders/${order.id}`),
  });

  const handleConfirm = async () => {
    setOpen(false);
    try {
      await doRequest();
      toast.success("Order created successfully!");
    } catch (err) {
      toast.error("Failed to create order. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`px-6 py-2 rounded-xl shadow-lg transition-all duration-300 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center"
            >
              <div className="flex justify-center items-center w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m0-4h.01M12 6.75A5.25 5.25 0 106.75 12 5.25 5.25 0 0012 6.75zM12 2.25a9.75 9.75 0 11-9.75 9.75A9.75 9.75 0 0112 2.25z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Confirm Purchase
              </h2>
              <p className="text-gray-500 mb-6">
                Are you sure you want to buy{" "}
                <strong className="text-indigo-600">
                  {ticket.title} ticket
                </strong>{" "}
                for <strong className="text-indigo-600">${ticket.price}</strong>
                ?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg transition"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
