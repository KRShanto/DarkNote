import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLoadingStore } from "@/stores/loading";
import fetcher from "@/lib/fetcher";

import { FaLock } from "react-icons/fa";
import {
  addNotebookProtectionToken,
  getNotebookProtectionTokenById,
} from "@/lib/session";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");
  const [needToUnlock, setNeedToUnlock] = useState(false); // TODO: get a better solution: use boolean | null
  const [bookNotFound, setBookNotFound] = useState(false);
  const [protectionToken, setProtectionToken] = useState("");
  const [protectionKey, setProtectionKey] = useState("");

  const { turnOn, turnOff } = useLoadingStore();

  const router = useRouter();
  const { id } = router.query;

  async function handleUnlock() {
    if (protectionKey.length === 0) {
      console.log("No protection key entered");
      return;
    }

    const json = await fetcher(`/api/unlock-notebook`, {
      id,
      protectionKey,
    });

    console.log(json);

    if (json.type === "SUCCESS") {
      // // Save the `protectionToken` to the session storage
      // sessionStorage.setItem("protectionToken", json.data);

      // Save the `protectionToken` to the session storage
      addNotebookProtectionToken(id as string, json.data);
      setNeedToUnlock(false);
    } else if (json.type === "INVALID") {
      console.log("Invalid protection key");
    } else {
      console.error("ERROR");
    }
  }

  useEffect(() => {
    async function getNotebook() {
      turnOn();

      // // Get the `protectionToken` from the session storage
      // const protectionTokenFromSession =
      //   sessionStorage.getItem("protectionToken");

      // Get the `protectionToken` from the session storage
      const protectionTokenFromSession = getNotebookProtectionTokenById(
        id as string
      );

      console.log(protectionTokenFromSession);

      const json = await fetcher("/api/get-book", {
        id,
        protectionToken: protectionTokenFromSession,
      });

      console.log(json);

      // TODO: handle cases: NOTFOUND, LOCKED, SUCCESS
      if (json.type === "SUCCESS") {
        // TODO redirect to the note page
        console.log("SUCCESS");
        setProtectionToken(protectionTokenFromSession || "");
      } else if (json.type === "LOCKED") {
        console.log("LOCKED");
        setNeedToUnlock(true);
      } else if (json.type === "NOTFOUND") {
        console.log("Book is not found");
        setBookNotFound(true);
      }

      turnOff();
    }

    if (id) getNotebook();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title || !content) {
      return setError("Please fill in all fields");
    }

    try {
      const body = { id, title, content, locked, protectionToken };
      const json = await fetcher("/api/create-note", body);

      console.log(json);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <div>
      {needToUnlock ? (
        <div>
          <label htmlFor="protectionKey">
            This note is protected. Please enter the protection key to unlock
            it.
          </label>
          <input
            type="text"
            name="protectionKey"
            id="protectionKey"
            value={protectionKey}
            onChange={(e) => setProtectionKey(e.target.value)}
          />
          <button onClick={handleUnlock} disabled={protectionKey.length === 0}>
            Unlock
          </button>
        </div>
      ) : (
        <form id="create-book" onSubmit={handleSubmit}>
          <h1 className="heading">Create Note</h1>

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
            <label htmlFor="description">Content</label>
            <textarea
              name="description"
              id="description"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="lock" onClick={() => setLocked(!locked)}>
            <FaLock className={`icon ${locked ? "active" : ""}`} />
            <p>Lock Book</p>
          </div>

          <button type="submit" className="submit-button">
            Create Book
          </button>
        </form>
      )}
    </div>
  );
}