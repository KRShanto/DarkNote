import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import Note from "./Note";
import { NoteType } from "@/types/data/note";

export default function Book({ book }: { book: any }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="book">
      <button className="header" onClick={toggle}>
        <div className="title">{book.title}</div>
        <IoIosArrowForward
          className="toggle"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
        />
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
