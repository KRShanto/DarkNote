import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import fetcher from "@/lib/fetcher";
import { NoteType } from "@/types/data/note";
import { addProtectionToken, getProtectionTokenById } from "@/lib/session";
import Link from "next/link";
import { FaClock, FaLock } from "react-icons/fa";
import moment from "moment";
import DeleteNote from "@/components/note/DeleteNote";
import NotFoundMessage from "../NotFoundMessage";
import { useSession } from "next-auth/react";
import NotLoggedInMessage from "../NotLoggedInMessage";
import ProtectionKeyForm from "../ProtectionKeyForm";
import { useLoadingStore } from "@/stores/loading";

export default function DisplayNote() {
  const router = useRouter();
  // id: {notebookId}-{noteId}
  const { id } = router.query;

  const [needToUnlock, setNeedToUnlock] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [protectionToken, setProtectionToken] = useState<string | null>();
  const [noteNotFound, setNoteNotFound] = useState(false);

  const [note, setNote] = useState<NoteType>();

  const [noteId, setNoteId] = useState<string>();
  const [notebookId, setNotebookId] = useState<string>();

  const { status } = useSession();
  const { turnOn, turnOff } = useLoadingStore();

  function afterUnlock(data: any) {
    addProtectionToken(notebookId as string, data.protectionToken);
    setNote(data.note);
    setNeedToUnlock(false);
    setProtectionToken(data.protectionToken);
  }

  async function getNotes() {
    const protectionToken = getProtectionTokenById(notebookId as string);

    turnOn();
    const json = await fetcher(`/api/get-note`, {
      id: noteId,
      notebookId,
      protectionToken: protectionToken,
    });
    turnOff();

    if (json.type === "SUCCESS") {
      setNote(json.data);
      setProtectionToken(protectionToken);
    } else if (json.type === "LOCKED") {
      setNeedToUnlock(true);
    } else if (json.type === "NOTFOUND") {
      setNoteNotFound(true);
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
    if (notebookId && noteId) getNotes();
  }, [notebookId, noteId]);

  if (noteNotFound) {
    return <NotFoundMessage what="NOTE" />;
  }

  if (status === "unauthenticated") {
    return <NotLoggedInMessage />;
  }

  return (
    <div>
      {needToUnlock ? (
        <ProtectionKeyForm
          afterUnlock={afterUnlock}
          id={noteId as string}
          path="/api/unlock-notebook-and-get-note"
        />
      ) : deletePopup ? (
        <DeleteNote
          noteId={noteId as string}
          notebookId={notebookId as string}
          protectionToken={protectionToken as string}
          setDeletePopup={setDeletePopup}
        />
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
    </div>
  );
}
