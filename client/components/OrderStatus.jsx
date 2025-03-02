import { useRouter } from "next/navigation";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function OrderStatus({ status, timeLeft }) {
  const router = useRouter();
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const BuyAgainButton = (
    <button
      onClick={() => router.push("/")}
      className="text-indigo-600 underline mt-2"
    >
      Buy Again
    </button>
  );

  if (status === "created") {
    return (
      <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg px-4 py-3 mb-4 shadow-sm">
        <AiOutlineClockCircle className="h-5 w-5" />
        <span className="text-sm font-medium">
          Time left: {formatTime(timeLeft)}
        </span>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="text-center font-medium bg-red-50 text-red-600 border border-red-300 rounded-lg px-4 py-3 mb-4 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <FaTimesCircle className="h-5 w-5 text-red-600" />
          <span>Order Expired or Cancelled.</span>
        </div>
        {BuyAgainButton}
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="text-center font-medium bg-green-50 text-green-600 border border-green-300 rounded-lg px-4 py-3 mb-4 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <FaCheckCircle className="h-5 w-5 text-green-600" />
          <span>Order completed. Thank you for your purchase!</span>
        </div>
        {BuyAgainButton}
      </div>
    );
  }

  return null;
}
