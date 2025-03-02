import Buttons from "./Buttons";
import CreateOrderButton from "./CreateOrderButton";

const TicketCard = ({ ticket }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white text-indigo-700">
      <div className="flex flex-col">
        <h4 className="text-2xl font-semibold">{ticket.title}</h4>
        <p className="text-lg mt-2">Price: ${ticket.price}</p>
      </div>
      <div className="mt-4 text-right">
        {!ticket.orderID ? (
          <CreateOrderButton ticket={ticket} />
        ) : (
          <Buttons
            label="Sold"
            className="px-6 py-2 rounded-xl shadow-lg bg-gray-400 text-white cursor-not-allowed"
          />
        )}
      </div>
    </div>
  );
};

export default TicketCard;
