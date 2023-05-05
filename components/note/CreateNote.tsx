import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLoadingStore } from "@/stores/loading";
import fetcher from "@/lib/fetcher";
import { addProtectionToken, getProtectionTokenById } from "@/lib/session";
import { generateNotePath } from "@/lib/notepage";
import RichEditor from "./RichEditor";
import NotFoundMessage from "../NotFoundMessage";
import { useSession } from "next-auth/react";
import { FaLock } from "react-icons/fa";
import NotLoggedInMessage from "../NotLoggedInMessage";
import { ReturnedJsonType } from "@/types/json";
import ProtectionKeyForm from "../ProtectionKeyForm";

export default function CreateNote() {
  // form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  const [needToUnlock, setNeedToUnlock] = useState(false); // TODO: get a better solution: use boolean | null
  const [bookNotFound, setBookNotFound] = useState(false);
  const [protectionToken, setProtectionToken] = useState("");

  const { turnOn, turnOff } = useLoadingStore();
  const { status } = useSession();

  const router = useRouter();
  const { id } = router.query;

  function afterUnlock(data: any) {
    // Save the `protectionToken` to the session storage
    addProtectionToken(id as string, data);
    // Update the unlocked state
    setNeedToUnlock(false);
  }

  useEffect(() => {
    async function getNotebook() {
      turnOn();

      // Get the `protectionToken` from the session storage
      const protectionTokenFromSession = getProtectionTokenById(id as string);

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
      const body = { id, title, content, textContent, locked, protectionToken };
      const json = await fetcher("/api/create-note", body);

      console.log(json);

      // redirect to notebook page
      router.push(generateNotePath(json.data._id, id as string));
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  }

  if (router.isFallback) {
    return <></>;
  }

  if (!id || bookNotFound) {
    return <NotFoundMessage what="NOTEBOOK" />;
  }

  if (status === "unauthenticated") {
    return <NotLoggedInMessage />;
  }

  return (
    <div>
      {needToUnlock ? (
        <ProtectionKeyForm
          path="/api/unlock-notebook"
          id={id as string}
          afterUnlock={afterUnlock}
        />
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

          <RichEditor
            content={content}
            setContent={setContent}
            textContent={textContent}
            setTextContent={setTextContent}
          />

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
