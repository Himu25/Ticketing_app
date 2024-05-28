import Navbar from "@/components/Navbar";
import { buildClient } from "@/services/build-client";

async function getData() {
  const client = buildClient()
  const res = await client.get('/api/users/currentUser');
  console.log("hello", res.data);
  return res.data;
}

export default async function Page() {
  const data = await getData();
  return (
    <>
      <Navbar user={data.currentUser} />
      <main>{data ? data.currentUser?.email : "Hello"}</main>
    </>
  );
}
