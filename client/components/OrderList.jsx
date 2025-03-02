const OrdersList = ({ orders }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "created":
        return "bg-blue-100 text-blue-700 border-blue-400";
      case "completed":
        return "bg-green-100 text-green-700 border-green-400";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400";
    }
  };

  return (
    <div className="container mt-20 mx-auto p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl shadow-lg p-5 bg-white hover:shadow-xl transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {order.ticket.title}
            </h2>
            <p className="text-gray-600 mb-1">
              <strong>Order ID:</strong> {order.id}
            </p>
            <p className="text-gray-600 mb-3">
              <strong>Price:</strong> ${order.ticket.price}
            </p>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg border ${getStatusStyles(
                order.status
              )}`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;
