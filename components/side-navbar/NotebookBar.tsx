import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import React from "react";
import Book from "./Book";
import { FadeLoader } from "react-spinners";

import { AiFillFileAdd } from "react-icons/ai";
import { HiFolderPlus } from "react-icons/hi2";
import { VscCollapseAll } from "react-icons/vsc";
import { useCollapseStore } from "@/stores/collapse";

export default function NotebookBar() {
  const { books, loading } = useBooksWithNotesStore();
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

      {loading ? (
        <div className="local-spinner">
          <FadeLoader color="cyan" />
        </div>
      ) : (
        <>
          {books.map((book) => (
            <Book key={book._id} book={book} />
          ))}
        </>
      )}
    </div>
  );
}
