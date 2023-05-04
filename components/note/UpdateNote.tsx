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

export default function CreateNote() {
  const router = useRouter();
  const { id } = router.query; // TODO
  // the `id` is separated by {notebookId}-{noteId}

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  const [needToUnlock, setNeedToUnlock] = useState(false);
  const [protectionKey, setProtectionKey] = useState("");
  const [note, setNote] = useState<NoteType>();
  const [protectionToken, setProtectionToken] = useState("");

  const [notebookId, setNotebookId] = useState<string>();
  const [noteId, setNoteId] = useState<string>();

  async function handleUnlock() {
    if (protectionKey.length === 0) {
      console.log("No protection key entered");
      return;
    }

    const json = await fetcher(`/api/unlock-notebook-and-get-note`, {
      notebookId,
      protectionKey,
    });

    console.log(json);

    if (json.type === "SUCCESS") {
      // Save the `protectionToken` to the session storage
      // sessionStorage.setItem("protectionToken", json.data);
      // sessionStorage.setItem("protectionToken", json.data.protectionToken);
      // addNotebookProtectionToken(id as string, json.data.protectionToken);
      addProtectionToken(notebookId as string, json.data.protectionToken);
      //   setNote(json.data.notes);

      setNeedToUnlock(false);
    } else if (json.type === "INVALID") {
      console.log("Invalid protection key");
    } else {
      console.error("ERROR");
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
    async function getNotes() {
      // const res = await fetcher(`/api/get-notes`, {
      //   id: id,

      // });

      // Get the `protectionToken` from the session storage
      // const protectionToken = sessionStorage.getItem("protectionToken");
      // const protectionToken = getNotebookProtectionTokenById(id as string);
      //   const protectionToken = getProtectionTokenById(notebookId as string);

      console.log(protectionToken);

      const json = await fetcher(`/api/get-note`, {
        id: noteId,
        notebookId,
        protectionToken: protectionToken,
      });

      console.log(json);

      if (json.type === "SUCCESS") {
        setNote(json.data);
        setTitle(json.data.title);
        setContent(json.data.content);
        setLocked(json.data.locked);
      } else if (json.type === "LOCKED") {
        setNeedToUnlock(true);
      } else {
        console.error("ERROR");
      }
    }

    //   if (id) getNotes();
    // }, [id]);
    if (protectionToken) getNotes();
  }, [protectionToken]);

  useEffect(() => {
    if (notebookId && noteId) {
      const protectionToken = getProtectionTokenById(notebookId);
      setProtectionToken(protectionToken || "NULL");
    }
  }, [notebookId, noteId]);

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
        locked,
        protectionToken,
      };
      const json = await fetcher("/api/update-note", body);

      console.log(json);

      // redirect to notebook page
      // TODO: show a success popup
      router.push(generateNotePath(json.data._id, id as string));
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

          {/* <div className="form-wrapper">
            <label htmlFor="description">Content</label>
            <textarea
              name="description"
              id="description"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div> */}

          <RichEditor content={content} setContent={setContent} />

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
