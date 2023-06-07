import { useState } from "react";
import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import SideLink from "./SideLink";
import UserPic from "./UserPic";
import Book from "./Book";

// icons
import { AiOutlineSetting } from "react-icons/ai";
import { FaBook } from "react-icons/fa";
import { RiNotification2Line } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";

export default function SideNavbar() {
  const [notebookBarActive, setNotebookBarActive] = useState(true);
  const { books } = useBooksWithNotesStore();

  function toggle() {
    setNotebookBarActive(!notebookBarActive);
  }

  return (
    <div className={`side-navbar ${notebookBarActive ? "note-active" : ""}`}>
      <div className="links">
        <button
          className={`link ${notebookBarActive ? "active" : ""} `}
          onClick={toggle}
        >
          <FaBook />
        </button>

        <SideLink href="/settings">
          <AiOutlineSetting />
        </SideLink>

        <SideLink href="/notifications">
          <RiNotification2Line />
        </SideLink>

        <SideLink href="/friends">
          <FiUsers />
        </SideLink>

        <UserPic />
      </div>

      <div className="notebook-bar">
        {books.map((book) => (
          <Book key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
}
