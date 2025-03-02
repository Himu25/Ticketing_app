import TicketCard from "@/components/TicketCard";
import { buildClient } from "@/services/build-client";

async function getData() {
  const client = buildClient();
  const res = await client.get("/api/tickets/getByUser");
  console.log("🚀 ~ getData ~ res:", res.data);
  return res.data;
}

export default async function Page() {
  const { tickets } = await getData();
  return (
    <div className="space-y-6 p-5 mt-16">
      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tickets.map((ticket, index) => (
            <TicketCard key={index} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
