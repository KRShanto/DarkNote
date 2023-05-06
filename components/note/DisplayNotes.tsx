import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import fetcher from "@/lib/fetcher";
import { NoteType } from "@/types/data/note";
import { addProtectionToken, getProtectionTokenById } from "@/lib/session";
import Link from "next/link";
import { FaClock, FaLock } from "react-icons/fa";
import moment from "moment";
import { generateNotePath } from "@/lib/notepage";
import NotFoundMessage from "../NotFoundMessage";
import { useSession } from "next-auth/react";
import NotLoggedInMessage from "../NotLoggedInMessage";
import ProtectionKeyForm from "../ProtectionKeyForm";
import { useLoadingStore } from "@/stores/loading";
import { NotebookType } from "@/types/data/notebook";
import DeleteBook from "../notebook/DeleteBook";

export default function DisplayNotes() {
  const router = useRouter();
  const { id } = router.query;

  const [notes, setNotes] = useState<NoteType[]>([]);
  const [notebook, setNotebook] = useState<NotebookType>();

  const [needToUnlock, setNeedToUnlock] = useState(false);
  const [bookNotFound, setBookNotFound] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const { status } = useSession();
  const { turnOn, turnOff } = useLoadingStore();

  function afterUnlock(data: any) {
    addProtectionToken(id as string, data.protectionToken);
    setNotes(data.notes);
    setNeedToUnlock(false);
  }

  async function getNotebook() {
    turnOn();
    const json = await fetcher(`/api/get-book`, {
      id,
    });
    turnOff();

    if (json.type === "SUCCESS") {
      setNotebook(json.data);
    } else if (json.type === "NOTFOUND") {
      setBookNotFound(true);
    } else {
      console.error("ERROR");
    }
  }

  async function getNotes() {
    const protectionToken = getProtectionTokenById(id as string);

    turnOn();
    const json = await fetcher(`/api/get-notes`, {
      id,
      protectionToken,
    });
    turnOff();

    if (json.type === "SUCCESS") {
      setNotes(json.data);
    } else if (json.type === "LOCKED") {
      setNeedToUnlock(true);
    } else if (json.type === "NOTFOUND") {
      setBookNotFound(true);
    } else {
      console.error("ERROR");
    }
  }

  useEffect(() => {
    if (id) {
      getNotebook();
      getNotes();
    }
  }, [id]);

  if (bookNotFound) {
    return <NotFoundMessage what="NOTEBOOK" />;
  }

  if (status === "unauthenticated") {
    return <NotLoggedInMessage />;
  }

  return (
    <div>
      {needToUnlock ? (
        <ProtectionKeyForm
          afterUnlock={afterUnlock}
          id={id as string}
          path="/api/unlock-notebook-and-get"
        />
      ) : deletePopup ? (
        <DeleteBook
          id={id as string}
          protectionToken={getProtectionTokenById(id as string) as string}
          setDeletePopup={setDeletePopup}
        />
      ) : (
        <div className="display-book">
          <div className="header">
            <div className="title-info">
              <h1 className="title">{notebook?.title}</h1>
              <div className="info">
                <span className="date">
                  <FaClock />{" "}
                  {moment(notebook?.createdAt).format("MMMM Do YYYY")}
                </span>
              </div>
            </div>

            <hr />

            <div className="options">
              <Link className="edit btn" href={`/edit-book/${notebook?._id}`}>
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
            </div>
          </div>

          <div className="display">
            {notes.map((note) => (
              <Link
                href={generateNotePath(note._id, id as string)}
                key={note._id}
                className="card"
              >
                <div className="main">
                  <h1 className="title">
                    {note.title.length > 35
                      ? note.title.substring(0, 35) + "...."
                      : note.title}
                  </h1>
                  <p className="description">
                    {note.textContent.length > 200
                      ? note.textContent.substring(0, 200) + "........"
                      : note.textContent}
                  </p>
                </div>
                <div className="info">
                  <p className="createdAt">
                    <FaClock />
                    {moment(note.createdAt).fromNow()}
                  </p>
                  {note.locked && (
                    <FaLock className="locked" title="This note is locked" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
