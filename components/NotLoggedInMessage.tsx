import React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function NotLoggedInMessage() {
  return (
    <div className="not-logged-in confirm">
      <h1 className="text">You need to be logged in to perform this action.</h1>

      <div className="options">
        <Link href="/" className="btn">
          Go Home
        </Link>

        <button className="btn sky" onClick={() => signIn()}>
          Login
        </button>

        <button className="btn sky" onClick={() => signIn()}>
          Create Account
        </button>
      </div>
    </div>
  );
}
