import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NoteType } from "@/types/data/note";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import moment from "moment";
import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { FadeLoader } from "react-spinners";
import { usePopupStore } from "@/stores/popup";
import Lottie from "lottie-react";
import KidNotFoundAnimation from "@/public/animations/kid-not-found.json";

export default function DisplayNote() {
  const [note, setNote] = useState<NoteType | null>();

  const router = useRouter();
  const { id } = router.query;

  const { books, loading } = useBooksWithNotesStore();
  const { openPopup } = usePopupStore();

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
            <Link className="btn success" href={`/edit-note/${note?._id}`}>
              Edit Note
            </Link>

            <button className="btn danger" onClick={deleteNote}>
              Delete Note
            </button>
          </div>
        </div>

        <div className="content">
          <div
            dangerouslySetInnerHTML={{ __html: note?.content as string }}
            className="inner-content"
          ></div>
        </div>
      </div>
    </div>
  );
}
