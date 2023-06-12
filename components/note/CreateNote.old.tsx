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
import ProtectionKeyForm from "../ProtectionKeyForm";
import { NotebookType } from "@/types/data/notebook";

export default function CreateNoteOld() {
  // form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  const [book, setBook] = useState<NotebookType>();
  const [needToUnlock, setNeedToUnlock] = useState(false); // TODO: get a better solution: use boolean | null
  const [bookNotFound, setBookNotFound] = useState(false);
  const [protectionToken, setProtectionToken] = useState("");

  const { turnOn, turnOff } = useLoadingStore();
  const { status } = useSession();

  const router = useRouter();
  // id of the notebook
  const { id } = router.query;

  function afterUnlock(data: any) {
    // Save the `protectionToken` to the session storage
    addProtectionToken(id as string, data);
    // Update the unlocked state
    setNeedToUnlock(false);
    // Update the notebook
    setBook(data);
  }

  async function getNotebook() {
    // Get the `protectionToken` from the session storage
    const protectionTokenFromSession = getProtectionTokenById(id as string);

    console.log("protectionToken: ", protectionTokenFromSession);

    turnOn();
    const json = await fetcher("/api/get-book", {
      id,
    });
    turnOff();

    console.log("json: ", json);

    if (json.type === "SUCCESS") {
      setProtectionToken(protectionTokenFromSession || "");
      setBook(json.data);
    } else if (json.type === "LOCKED") {
      setNeedToUnlock(true);
    } else if (json.type === "NOTFOUND") {
      setBookNotFound(true);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title || !content) {
      return setError("Please fill in all fields");
    }

    const body = { id, title, content, textContent, locked, protectionToken };

    turnOn();
    const json = await fetcher("/api/create-note", body);
    turnOff();

    if (json.type === "SUCCESS") {
      // redirect to notebook page
      router.push(generateNotePath(json.data._id, id as string));
    } else if (json.type === "LOCKED") {
      setNeedToUnlock(true);
    } else if (json.type === "INVALID") {
      setError("You need to fill in all fields");
    } else {
      setError("Something went wrong");
    }
  }

  useEffect(() => {
    if (id) getNotebook();
  }, [id]);

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
