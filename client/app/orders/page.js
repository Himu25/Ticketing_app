import OrdersList from "@/components/OrderList";
import { buildClient } from "@/services/build-client";

async function fetchOrders() {
  const client = buildClient();
  const res = await client.get("/api/orders/");
  return res.data;
}
export default async function Page() {
  const orders = await fetchOrders();
  console.log(orders);
  return <OrdersList orders={orders} />;
}
