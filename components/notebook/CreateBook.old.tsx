import fetcher from "@/lib/fetcher";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useLoadingStore } from "@/stores/loading";
import NotLoggedInMessage from "../NotLoggedInMessage";

// import lock icon
import { FaLock } from "react-icons/fa";
// import unlock icon
import { FaUnlock } from "react-icons/fa";

export default function CreateBook() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const { data: session, status } = useSession();
  const { turnOn, turnOff } = useLoadingStore();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title || !description) {
      return setError("Please fill in all fields");
    }

    try {
      const body = { title, description, locked };

      turnOn();
      const json = await fetcher("/api/create-book", body);
      turnOff();

      if (json.type !== "SUCCESS") {
        throw new Error(json.msg);
      } else {
        // redirect to the book page
        router.push(`/book/${json.data._id}`);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  }

  if (!session) {
    return <NotLoggedInMessage />;
  }

  return (
    <form id="create-book" onSubmit={handleSubmit}>
      <h1 className="heading">Create Book</h1>

      {error && <p className="error">{error}</p>}

      <div className="form-wrapper">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-wrapper">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="lock">
        {locked ? (
          <FaLock className="icon active" onClick={() => setLocked(!locked)} />
        ) : (
          <FaUnlock className="icon" onClick={() => setLocked(!locked)} />
        )}
      </div>

      <button type="submit">Create Book</button>
    </form>
  );
}
