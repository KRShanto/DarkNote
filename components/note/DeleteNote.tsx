import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import { NoteType } from "@/types/data/note";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { getProtectionTokenById } from "@/lib/session";
import Popup from "../utils/Popup";
import PostButton from "../utils/PostButton";
import { ReturnedJsonType } from "@/types/json";
import { useRouter } from "next/router";

export default function DeleteNote() {
  const [protectionToken, setProtectionToken] = useState<string>("");

  const { loading, deleteNote } = useBooksWithNotesStore();
  const { data, closePopup } = usePopupStore();
  const { note } = data as { note: NoteType };

  const router = useRouter();

  useEffect(() => {
    if (!note) throw new Error("No note `note` provided in popup data");

    const protectionToken = getProtectionTokenById(note.notebookId);

    setProtectionToken(protectionToken as string);
  }, [note]);

  function afterDelete(json: ReturnedJsonType) {
    if (json.type === "SUCCESS") {
      // Delete the note from the store
      deleteNote(note.notebookId as string, note._id as string);

      // Close the popup
      closePopup();

      // Go back to the home page
      router.push("/");
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
        Are you sure you want to delete this note <b>{note.title}</b>
      </p>

      <PostButton
        path="/api/delete-note"
        body={{
          id: note._id,
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
