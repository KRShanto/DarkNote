import { useState } from "react";
import Note from "./Note";
import { NoteType } from "@/types/data/note";
import { BookWithNotesType } from "@/types/data/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import { useBooksWithNotesStore } from "@/stores/booksWithNotes";

import { IoIosArrowForward } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { addProtectionToken } from "@/lib/session";

export default function Book({ book }: { book: BookWithNotesType }) {
  const [isOpen, setIsOpen] = useState(false);

  const { openPopup } = usePopupStore();
  const { addNotes, unlock } = useBooksWithNotesStore();

  // Toggle the book open and closed
  // If the book is locked, open Unlock popup
  function toggle() {
    // After unlock
    function afterUnlock(data: any) {
      addProtectionToken(book._id as string, data.protectionToken);
      addNotes(book._id as string, data.notes);
      unlock(book._id as string);
      setIsOpen(!isOpen);
    }

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

      {isOpen && (
        <div className="notes">
          {book.notes.map((note: NoteType, index: number) => (
            <Note note={note} index={index} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
