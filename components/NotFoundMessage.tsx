import Link from "next/link";
import React from "react";

export default function NotFoundMessage({
  what,
}: {
  what: "NOTEBOOK" | "NOTE";
}) {
  return (
    <div className="not-found-message">
      <h1 className="text">
        The {what.toLowerCase()} you are looking for does not exist.
      </h1>

      <div className="options">
        <Link href="/" className="btn">
          Go Home
        </Link>

        <Link href="/create-book" className="btn sky">
          Create Notebook
        </Link>

        <Link href="/report" className="btn mini-danger">
          Report an Issue
        </Link>
      </div>
    </div>
  );
}
