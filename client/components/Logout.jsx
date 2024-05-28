"use client"
import useRequest from "@/Hooks/useRequest";
import React from "react";
import toast from "react-hot-toast";

export default function Logout() {
  const { doRequest, errors, loading } = useRequest({
    url: "/api/users/signout",
    method: "get",
    body: {},
    onSuccess: () => {
        toast("User Logged out")
    },
  });
  return (
    <button
      onClick={() => doRequest()}
      disabled={loading}
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {loading ? "Loading..." : "Sign out"}
    </button>
  );
}
