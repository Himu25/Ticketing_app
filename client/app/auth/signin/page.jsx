"use client";
import useRequest from "@/Hooks/useRequest";
import Buttons from "@/components/Buttons";
import Errors from "@/components/Errors";
import InputBox from "@/components/InputBox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Example() {
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
  };
  return (
    <>
      <div className="flex min-h-full w-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputBox
              label="Email address"
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
            <Buttons label="Sign up" loading={loading} />
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
             Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
