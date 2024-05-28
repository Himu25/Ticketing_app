import Link from "next/link";
import React from "react";
import Logout from "./Logout";

export default function Navbar({user}) {
  return (
    <div className="w-full px-4 py-2 fixed top-0 bg-indigo-600 flex flex-row justify-between items-center">
      <h1 className="font-bold text-xl text-white">TixNow</h1>
      <div className="flex flex-row gap-1">
        {user ? (
          <Logout />
        ) : (
          <>
            <Link
              className="flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              href="/auth/signup"
            >
              Sign up
            </Link>
            <Link
              className="flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              href="/auth/signin"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
