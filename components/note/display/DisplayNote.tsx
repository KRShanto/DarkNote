import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NoteType } from "@/types/data/note";
import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { FadeLoader } from "react-spinners";
import RichEditor from "../RichEditor";
import { getProtectionTokenById } from "@/lib/session";
import fetcher from "@/lib/fetcher";
import { SAVE_AFTER } from "@/constants/general";
import { useEditModeStore } from "@/stores/editMode";
import Header from "./Header";
import NoNote from "./NoNote";

export default function DisplayNote() {
  const [note, setNote] = useState<NoteType | null>();
  const [content, setContent] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [contentBeforeSave, setContentBeforeSave] = useState<string>("");
  const [protectionToken, setProtectionToken] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);

  const router = useRouter();
  const { id, edit } = router.query;

  const { books, loading, updateNote } = useBooksWithNotesStore();
  const { editMode, turnOn, turnOff } = useEditModeStore();

  // reset edit mode when the page changes
  // and set edit mode if the query is `edit`
  useEffect(() => {
    if (edit) {
      turnOn();
    }

    return () => {
      turnOff();
    };
  }, [id]);

  // find the note from the books
  useEffect(() => {
    books.forEach((book) => {
      book.notes.forEach((note) => {
        if (note._id === id) {
          setNote(note);
        }
      });
    });
  }, [id, books]);

  // set the content of the note
  useEffect(() => {
    if (note) {
      setContent(note.content);
      setTextContent(note.textContent);
      setContentBeforeSave(note.content);
    }
  }, [note]);

  // set the protection token
  useEffect(() => {
    if (note) {
      const protectionToken = getProtectionTokenById(note.notebookId);
      setProtectionToken(protectionToken || "");
    }
  }, [note]);

  // every 2 seconds, save the note
  useEffect(() => {
    const interval = setInterval(() => {
      saveNote();
    }, SAVE_AFTER);

    return () => {
      clearInterval(interval);
    };
  }, [note, content, textContent, fetching, contentBeforeSave]);

  // Save the note
  async function saveNote() {
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
      // Update the store
      updateNote(note?.notebookId as string, note?._id as string, {
        content,
        textContent,
      });
    } else {
      console.error(json.msg);
    }
  }

  if (loading) {
    return (
      <div className="local-spinner">
        <FadeLoader color="cyan" />
      </div>
    );
  }

  if (!note) return <NoNote />;

  return (
    <div>
      <div className="display-note">
        <Header note={note} fetching={fetching} saveNote={saveNote} />

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
