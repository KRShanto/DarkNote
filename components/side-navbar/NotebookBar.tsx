import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import React from "react";
import Book from "./Book";

import { AiFillFileAdd } from "react-icons/ai";
import { HiFolderPlus } from "react-icons/hi2";
import { VscCollapseAll } from "react-icons/vsc";
import { useCollapseStore } from "@/stores/collapse";

export default function NotebookBar() {
  const { books } = useBooksWithNotesStore();
  const { openPopup } = usePopupStore();
  const { collapseNow } = useCollapseStore();

  function createNote() {
    openPopup("CreateNote", {});
  }

  function createBook() {
    openPopup("Createbook", {});
  }

  return (
    <div className="notebook-bar">
      <div className="main-header">
        <h3 className="title">Notebooks</h3>
        <div className="options">
          <AiFillFileAdd
            className="icon"
            title="New Note"
            onClick={createNote}
          />
          <HiFolderPlus
            className="icon"
            title="New Notebook"
            onClick={createBook}
          />
          <VscCollapseAll
            className="icon"
            title="Collapse notebooks"
            onClick={collapseNow}
          />
        </div>
      </div>
      <hr />

      {books.map((book) => (
        <Book key={book._id} book={book} />
      ))}
    </div>
  );
}
