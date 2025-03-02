"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useRequest from "@/Hooks/useRequest";
import Buttons from "@/components/Buttons";
import InputBox from "@/components/InputBox";
import toast from "react-hot-toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { doRequest, errors, loading } = useRequest({
    url: "/api/users/signIn",
    method: "post",
    body: { email, password },
    onSuccess: () => router.push("/"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
    if (errors) {
      toast.error(errors[0].message);
    }
  };

  return (
    <div className="flex justify-center items-center mt-8  px-6 py-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-center text-2xl font-semibold text-gray-900">
          Sign In
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1">
          Welcome back! Please enter your credentials.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <InputBox
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <InputBox
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <div className="flex justify-center">
            <Buttons label="Sign In" loading={loading} />
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Not a member?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
