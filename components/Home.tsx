import React from "react";
import Link from "next/link";

// icons
import { FaRegStickyNote } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { FaKeyboard } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { usePopupStore } from "@/stores/popup";

export default function Home() {
  const { openPopup } = usePopupStore();

  function createNote() {
    openPopup("CreateNote", {});
  }

  return (
    <>
      <div id="home">
        <h1 className="welcome">
          Welcome to <span className="logo">Dark Note</span>
        </h1>

        <div className="options">
          <button className="option btn light">
            <FaBook className="icon" />
            <p className="text">Create new Notebook</p>
          </button>

          <button className="option btn light" onClick={createNote}>
            <FaRegStickyNote className="icon" />
            <p className="text">Create new Note</p>
          </button>

          <button className="option btn light">
            <FaUserFriends className="icon" />
            <p className="text">Checkout the notes of your friends</p>
          </button>

          <Link href="#" className="option btn light">
            <FaKeyboard className="icon" />
            <p className="text">Keyboard shortcuts</p>
          </Link>

          <Link href="#" className="option btn light">
            <FaLock className="icon" />
            <p className="text">Change passwords</p>
          </Link>
        </div>
      </div>
    </>
  );
}
