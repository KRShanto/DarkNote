import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import React from "react";
import Book from "./Book";

import { AiFillFileAdd } from "react-icons/ai";
import { HiFolderPlus } from "react-icons/hi2";
import { VscCollapseAll } from "react-icons/vsc";

export default function NotebookBar() {
  const { books } = useBooksWithNotesStore();
  const { openPopup } = usePopupStore();

  function createNote() {
    openPopup("CreateNote", {});
  }

  function createBook() {
    openPopup("CreateNotebook", {});
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
          <VscCollapseAll className="icon" title="Collapse notebooks" />
        </div>
      </div>
      <hr />

      {books.map((book) => (
        <Book key={book._id} book={book} />
      ))}
    </div>
  );
}
