import { useEffect, useState } from "react";
import Note from "./Note";
import { NoteType } from "@/types/data/note";
import { BookWithNotesType } from "@/types/data/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { addProtectionToken } from "@/lib/session";
import { useCollapseStore } from "@/stores/collapse";

import { IoIosArrowForward } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { AiFillFileAdd } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineLock } from "react-icons/ai";
import { AiOutlineUnlock } from "react-icons/ai";

export default function Book({ book }: { book: BookWithNotesType }) {
  const [isOpen, setIsOpen] = useState(false);

  const { openPopup } = usePopupStore();
  const { addNotes, unlock } = useBooksWithNotesStore();
  const { collapse } = useCollapseStore();

  // When the `collapse` state changes, close the book
  useEffect(() => {
    setIsOpen(false);
  }, [collapse]);

  // After unlock
  function afterUnlock(data: any) {
    addProtectionToken(book._id as string, data.protectionToken);
    addNotes(book._id as string, data.notes);
    unlock(book._id as string);
    setIsOpen(!isOpen);
  }

  // Toggle the book open and closed
  // If the book is locked, open Unlock popup
  function toggle() {
    if (book.locked && book.unlocked !== true) {
      // Open unlock popup
      openPopup("Unlock", {
        path: "/api/unlock-notebook-and-get",
        id: book._id,
        afterUnlock: afterUnlock,
      });
    } else {
      setIsOpen(!isOpen);
    }
  }

  // Create a new note
  function createNote() {
    openPopup("CreateNote", { id: book._id });
  }

  // Delete the book
  function deleteBook() {
    openPopup("Deletebook", { book });
  }

  function renameBook() {
    openPopup("RenameBook", { book });
  }

  function changeLock() {
    openPopup("ChangeLock", { book });
  }

  return (
    <div className="book">
      <button className="header" onClick={toggle}>
        <div className="title">{book.title}</div>

        {book.locked && book.unlocked !== true ? (
          <FaLock className="lock" />
        ) : (
          <IoIosArrowForward
            className="toggle"
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        )}
      </button>

      <hr />

      {isOpen && book.unlocked && (
        <div className="book-options">
          <AiFillFileAdd
            className="icon new"
            title="New Note"
            onClick={createNote}
          />
          <AiOutlineDelete
            className="icon delete"
            title="Delete Notebook"
            onClick={deleteBook}
          />
          <AiOutlineEdit
            className="icon edit"
            title="Rename Notebook"
            onClick={renameBook}
          />

          {book.locked ? (
            <AiOutlineUnlock
              className="icon lock"
              title="Unlock Notebook"
              onClick={changeLock}
            />
          ) : (
            <AiOutlineLock
              className="icon lock"
              title="Lock Notebook"
              onClick={changeLock}
            />
          )}
        </div>
      )}

      {isOpen && book.unlocked && (
        <div className="notes">
          {book.notes.map((note: NoteType, index: number) => (
            <Note note={note} index={index} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
