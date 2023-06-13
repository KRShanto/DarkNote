import { NoteType } from "@/types/data/note";
import React from "react";
import { FaClock } from "react-icons/fa";
import moment from "moment";
import { useEditModeStore } from "@/stores/editMode";
import { BeatLoader } from "react-spinners";
import { usePopupStore } from "@/stores/popup";

export default function Header({
  note,
  fetching,
  saveNote,
}: {
  note: NoteType;
  fetching: boolean;
  saveNote: () => void;
}) {
  const { editMode, toggle } = useEditModeStore();
  const { openPopup } = usePopupStore();

  function deleteNote() {
    openPopup("DeleteNote", { id: note?._id });
  }

  return (
    <div className="header">
      <div className="title-info">
        <h1 className="title">{note?.title}</h1>
        <div className="info">
          <span className="date">
            <FaClock />
            {moment(note?.createdAt).format("MMMM Do YYYY")}
          </span>
        </div>
      </div>

      <hr />

      <div className="options">
        {editMode && (
          <button className="btn success" onClick={saveNote}>
            {fetching ? <BeatLoader color="white" size={8} /> : "Save Note"}
          </button>
        )}

        <button
          className={`btn ${editMode ? "light" : "blue"}`}
          onClick={() => toggle(note._id)}
        >
          {editMode ? "Stop Editing" : "Start Editing"}
        </button>

        <button className="btn danger" onClick={deleteNote}>
          Delete Note
        </button>
      </div>
    </div>
  );
}
