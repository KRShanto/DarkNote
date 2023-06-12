import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLoadingStore } from "@/stores/loading";
import fetcher from "@/lib/fetcher";
import { addProtectionToken, getProtectionTokenById } from "@/lib/session";
import { FaLock } from "react-icons/fa";
import { generateNotePath } from "@/lib/notepage";
import RichEditor from "./RichEditor";
import { NotebookType } from "@/types/data/notebook";
import { NoteType } from "@/types/data/note";
import NotFoundMessage from "../NotFoundMessage";
import { useSession } from "next-auth/react";
import NotLoggedInMessage from "../NotLoggedInMessage";
import ProtectionKeyForm from "../ProtectionKeyForm";

export default function CreateNote() {
  const router = useRouter();
  const { id } = router.query; // TODO
  // the `id` is separated by {notebookId}-{noteId}

  const { status } = useSession();
  const { turnOn, turnOff } = useLoadingStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  const [needToUnlock, setNeedToUnlock] = useState(false);
  const [protectionKey, setProtectionKey] = useState("");
  const [note, setNote] = useState<NoteType>();
  const [protectionToken, setProtectionToken] = useState("");

  const [notebookId, setNotebookId] = useState<string>();
  const [noteId, setNoteId] = useState<string>();

  const [noteNoteFound, setNoteNotFound] = useState(false);

  function afterUnlock(data: any) {
    addProtectionToken(notebookId as string, data.protectionToken);
    setNeedToUnlock(false);
  }

  async function getNotes() {
    turnOn();
    const json = await fetcher(`/api/get-note`, {
      id: noteId,
      notebookId,
      protectionToken,
    });
    turnOff();

    if (json.type === "SUCCESS") {
      setNote(json.data);
      setTitle(json.data.title);
      setContent(json.data.content);
      setLocked(json.data.locked);
    } else if (json.type === "LOCKED") {
      setNeedToUnlock(true);
    } else if (json.type === "NOTFOUND") {
      setNoteNotFound(true);
    } else {
      console.error("ERROR");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title || !content) {
      return setError("Please fill in all fields");
    }

    try {
      const body = {
        id: noteId,
        title,
        content,
        textContent,
        locked,
        protectionToken,
      };

      turnOn();
      const json = await fetcher("/api/update-note", body);
      turnOff();

      // redirect to note page
      router.push(generateNotePath(json.data._id, notebookId as string));
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  }

  useEffect(() => {
    if (id) {
      const idSplit = id as string;
      const [notebookId, noteId] = idSplit.split("-");

      setNotebookId(notebookId);
      setNoteId(noteId);
    }
  }, [id]);

  useEffect(() => {
    if (protectionToken) getNotes();
  }, [protectionToken]);

  useEffect(() => {
    if (notebookId && noteId) {
      const protectionToken = getProtectionTokenById(notebookId);
      setProtectionToken(protectionToken || "NULL");
    }
  }, [notebookId, noteId]);

  if (noteNoteFound) {
    return <NotFoundMessage what="NOTE" />;
  }

  if (status === "unauthenticated") {
    return <NotLoggedInMessage />;
  }

  return (
    <div>
      {needToUnlock ? (
        <ProtectionKeyForm
          id={noteId as string}
          path="/api/unlock-notebook-and-get-note"
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
