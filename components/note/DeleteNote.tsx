import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import { NoteType } from "@/types/data/note";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { SendType } from "../utils/form/Form";
import { getProtectionTokenById } from "@/lib/session";
import Popup from "../utils/Popup";
import PostButton from "../utils/PostButton";
import { ReturnedJsonType } from "@/types/json";

export default function DeleteNote() {
  const [note, setNote] = useState<NoteType | null>();
  const [protectionToken, setProtectionToken] = useState<string>("");

  const { books, loading, deleteNote } = useBooksWithNotesStore();
  const { data, closePopup } = usePopupStore();

  // find the note from the books
  // and also set the protection token
  useEffect(() => {
    if (!data.id) throw new Error("No note `id` provided in popup data");

    books.forEach((book) => {
      book.notes.forEach((note) => {
        if (note._id === data.id) {
          setNote(note);
        }
      });
    });

    const protectionToken = getProtectionTokenById(note?.notebookId as string);

    setProtectionToken(protectionToken as string);
  }, [data, books]);

  function afterDelete(json: ReturnedJsonType) {
    if (json.type === "SUCCESS") {
      // Delete the note from the store
      deleteNote(note?.notebookId as string, note?._id as string);

      // Close the popup
      closePopup();
    } else {
      console.log("Something went worng: ", json);
    }
  }

  if (loading) {
    return (
      <div className="local-spinner">
        <FadeLoader color="cyan" />
      </div>
    );
  }

  return (
    <Popup crossIcon title="Delete Note">
      <p className="tip">
        Are you sure you want to delete this note <b>{note?.title}</b>
      </p>

      <PostButton
        path="/api/delete-note"
        body={{
          id: note?._id,
          protectionToken,
        }}
        afterPost={afterDelete}
        className="btn danger"
      >
        Delete
      </PostButton>
    </Popup>
  );
}
