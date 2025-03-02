"use client";
import useRequest from "@/Hooks/useRequest";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function Logout() {
  const router = useRouter();
  const { doRequest, errors, loading } = useRequest({
    url: "/api/users/signout",
    method: "get",
    body: {},
    onSuccess: () => {
      toast.success("You have successfully logged out.");
      router.push("/auth/signin");
    },
  });

  return (
    <button
      onClick={() => doRequest()}
      disabled={loading}
      className="px-4 py-2 text-white font-semibold rounded-lg border border-white/20 transition duration-300 shadow-md hover:bg-white hover:text-indigo-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
