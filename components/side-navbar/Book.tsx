import { useState } from "react";
import Note from "./Note";
import { NoteType } from "@/types/data/note";
import { BookWithNotesType } from "@/types/data/booksWithNotes";

import { IoIosArrowForward } from "react-icons/io";
import { FaLock } from "react-icons/fa";

export default function Book({ book }: { book: BookWithNotesType }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    setIsOpen(!isOpen);
  }

  console.log("Unclock", book.unlocked);

  return (
    <div className="book">
      <button className="header" onClick={toggle}>
        <div className="title">{book.title}</div>

        {book.locked && book.unlocked !== true ? (
          <FaLock />
        ) : (
          <IoIosArrowForward
            className="toggle"
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        )}
      </button>

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
