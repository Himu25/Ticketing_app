import OrderDetails from "@/components/OrderDetails";
import { buildClient } from "@/services/build-client";

async function fetchOrderDetails(orderId) {
  const client = buildClient();
  const res = await client.get(`/api/orders/${orderId}`);
  return res.data;
}
export default async function Page({ params }) {
  const orderID = (await params).id;
  const orderDetails = await fetchOrderDetails(orderID);
  console.log("🚀 ~ Page ~ orderDetails :", orderDetails);
  return <OrderDetails order={orderDetails} />;
}
