"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logout from "./Logout";
import useRequest from "@/Hooks/useRequest";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  const { doRequest } = useRequest({
    url: "/api/users/currentUser",
    method: "get",
    onSuccess: (data) => setUser(data.currentUser),
  });

  useEffect(() => {
    doRequest();
  }, []);

  const linkClasses = (href) =>
    `px-4 py-2 text-white font-semibold rounded-lg transition duration-300 shadow-md border border-white/20 whitespace-nowrap ${
      pathname === href
        ? "bg-teal-400 text-indigo-900"
        : "bg-indigo-600 hover:bg-teal-500"
    }`;

  return (
    <nav className="w-full px-6 py-3 fixed top-0 left-0 bg-gradient-to-r from-indigo-800 to-indigo-600 shadow-lg flex items-center justify-between z-50">
      <h1 className="text-white text-2xl font-bold tracking-wide">
        Tix<span className="text-teal-300">Now</span>
      </h1>

      <div className="flex items-center gap-6">
        <Link href="/" className={linkClasses("/")}>
          All Tickets
        </Link>
        {user ? (
          <>
            <Link href="/sell-ticket" className={linkClasses("/sell-ticket")}>
              Sell Ticket
            </Link>
            <Link href="/your-tickets" className={linkClasses("/your-tickets")}>
              Your Tickets
            </Link>
            <Link href="/orders" className={linkClasses("/orders")}>
              Your Orders
            </Link>
            <Logout />
          </>
        ) : (
          <>
            <Link href="/auth/signup" className={linkClasses("/auth/signup")}>
              Sign Up
            </Link>
            <Link href="/auth/signin" className={linkClasses("/auth/signin")}>
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
