"use client";
import { toast } from "react-hot-toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelOrderButton({ orderId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Order cancelled successfully.", {
          duration: 3000,
          position: "top-center",
          style: { fontSize: "14px" },
        });
        router.refresh();
      } else {
        throw new Error("Failed to cancel the order.");
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to cancel the order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-3 mt-2 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {loading ? "Cancelling Order..." : "Cancel Order"}
    </button>
  );
}
