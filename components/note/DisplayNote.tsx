import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NoteType } from "@/types/data/note";
import { FaClock } from "react-icons/fa";
import moment from "moment";
import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { BeatLoader, FadeLoader } from "react-spinners";
import { usePopupStore } from "@/stores/popup";
import Lottie from "lottie-react";
import KidNotFoundAnimation from "@/public/animations/kid-not-found.json";
import RichEditor from "./RichEditor";
import { getProtectionTokenById } from "@/lib/session";
import fetcher from "@/lib/fetcher";
import { SAVE_AFTER } from "@/constants/general";

export default function DisplayNote() {
  const [note, setNote] = useState<NoteType | null>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [contentBeforeSave, setContentBeforeSave] = useState<string>("");
  const [protectionToken, setProtectionToken] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);

  const [i, setI] = useState<number>(0);

  const router = useRouter();
  const { id, edit } = router.query;

  const { books, loading } = useBooksWithNotesStore();
  const { openPopup } = usePopupStore();

  // reset edit mode when the page changes
  // and set edit mode if the query is `edit`
  useEffect(() => {
    if (edit) {
      setEditMode(true);
    }

    return () => {
      setEditMode(false);
    };
  }, [id]);

  useEffect(() => {
    // find the note from the books
    books.forEach((book) => {
      book.notes.forEach((note) => {
        if (note._id === id) {
          setNote(note);
        }
      });
    });
  }, [id, books]);

  useEffect(() => {
    if (note) {
      setContent(note.content);
      setTextContent(note.textContent);
      setContentBeforeSave(note.content);
    }
  }, [note]);

  useEffect(() => {
    if (note) {
      const protectionToken = getProtectionTokenById(note.notebookId);
      setProtectionToken(protectionToken || "");
    }
  }, [note]);

  useEffect(() => {
    // every 2 seconds, save the note
    const interval = setInterval(() => {
      saveNote();
    }, SAVE_AFTER);

    return () => {
      clearInterval(interval);
    };
  }, [note, content, textContent, fetching, contentBeforeSave]);

  async function saveNote() {
    console.log("I am trying to save the note");

    // Before saving, check if the content is the same as the content before saving
    // If it is, then don't save it
    if (content === contentBeforeSave) return;

    const body = {
      id: note?._id,
      content,
      textContent,
      protectionToken,
    };

    setFetching(true);
    const json = await fetcher("/api/update-note", body);
    setFetching(false);

    if (json.type === "SUCCESS") {
      setContentBeforeSave(content);
    } else {
      console.error(json.msg);
    }
  }

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function deleteNote() {
    openPopup("DeleteNote", { id: note?._id });
  }

  if (loading) {
    return (
      <div className="local-spinner">
        <FadeLoader color="cyan" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="note-not-found">
        <h1 className="text">Note not found.</h1>

        <Lottie
          animationData={KidNotFoundAnimation}
          className="animation"
          loop={true}
          autoplay={true}
        />

        <p className="tip">
          The note you are looking for does not exist or you do not have access
          to it.
        </p>

        <p className="tip">
          Unlock notebooks on the left to see the notes inside it.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="display-note">
        <div className="header">
          <div className="title-info">
            <h1 className="title">{note?.title}</h1>
            <div className="info">
              <span className="date">
                <FaClock />
                {moment(note?.createdAt).format("MMMM Do YYYY")}
              </span>
            </div>
          </div>

          <hr />

          <div className="options">
            {editMode && (
              <button className="btn success" onClick={saveNote}>
                {fetching ? <BeatLoader color="white" size={8} /> : "Save Note"}
              </button>
            )}

            <button
              className={`btn ${editMode ? "light" : "blue"}`}
              onClick={toggleEditMode}
            >
              {editMode ? "Stop Editing" : "Start Editing"}
            </button>

            <button className="btn danger" onClick={deleteNote}>
              Delete Note
            </button>
          </div>
        </div>

        {editMode ? (
          <>
            <RichEditor
              content={content}
              setContent={setContent}
              setTextContent={setTextContent}
            />
          </>
        ) : (
          <div className="content">
            <div
              dangerouslySetInnerHTML={{ __html: note?.content as string }}
              className="inner-content"
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
