import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import fetcher from "@/lib/fetcher";
import { NoteType } from "@/types/data/note";
import { addProtectionToken, getProtectionTokenById } from "@/lib/session";
import Link from "next/link";
import { FaClock, FaLock } from "react-icons/fa";
import moment from "moment";

export default function DisplayNote() {
  const router = useRouter();
  const { id } = router.query; // TODO
  // the `id` is separated by {notebookId}-{noteId}

  const [needToUnlock, setNeedToUnlock] = useState(false);
  const [protectionKey, setProtectionKey] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);

  const [note, setNote] = useState<NoteType>();

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
      setNote(json.data.notes);
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
      const protectionToken = getProtectionTokenById(notebookId as string);

      console.log(protectionToken);

      const json = await fetcher(`/api/get-note`, {
        id: noteId,
        notebookId,
        protectionToken: protectionToken,
      });

      console.log(json);

      if (json.type === "SUCCESS") {
        setNote(json.data);
      } else if (json.type === "LOCKED") {
        setNeedToUnlock(true);
      } else {
        console.error("ERROR");
      }
    }

    //   if (id) getNotes();
    // }, [id]);
    if (notebookId && noteId) getNotes();
  }, [notebookId, noteId]);

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
        <div className="display-note">
          <div className="header">
            <div className="title-info">
              <h1 className="title">{note?.title}</h1>
              <div className="info">
                <span className="date">
                  <FaClock /> {moment(note?.createdAt).format("MMMM Do YYYY")}
                </span>
              </div>
            </div>

            <hr />

            <div className="options">
              <Link
                className="edit btn"
                href={`/edit-note/${notebookId}-${noteId}`}
              >
                Edit Note
              </Link>

              <button
                className="btn danger"
                onClick={() => {
                  setDeletePopup(true);
                }}
              >
                Delete Note
              </button>
              <button className="btn">Full Screen</button>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: note?.content as string }}
            className="content"
          ></div>
        </div>
      )}

      {deletePopup && (
        <DeletePopup
          noteId={noteId as string}
          notebookId={notebookId as string}
          protectionToken={protectionKey}
          setDeletePopup={setDeletePopup}
        />
      )}
    </div>
  );
}

function DeletePopup({
  noteId,
  notebookId,
  protectionToken,
  setDeletePopup,
}: {
  noteId: string;
  notebookId: string;
  protectionToken: string;
  setDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  async function handleDelete() {
    const json = await fetcher("/api/delete-note", {
      id: noteId,
      protectionToken,
    });

    console.log(json);

    if (json.type === "SUCCESS") {
      // redirect to notebook page
      router.push(`/book/${notebookId}`);
    } else {
      console.error("ERROR");
      console.error(json);
    }
  }

  return (
    <div className="delete-popup">
      <p>Are you sure you want to delete this note?</p>
      <div className="options">
        <button className="btn" onClick={() => setDeletePopup(false)}>
          Cancel
        </button>
        <button className="btn danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
