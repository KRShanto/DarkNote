import React, { useState, useEffect } from "react";
import { SendType } from "../utils/form/Form";
import { usePopupStore } from "@/stores/popup";
import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import PopupForm from "../utils/PopupForm";
import Input from "../utils/form/Input";
import Checkbox from "../utils/form/Checkbox";
import Submit from "../utils/form/Submit";

export default function CreateBook() {
  const [title, setTitle] = useState("");
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  const { add } = useBooksWithNotesStore();
  const { closePopup } = usePopupStore();

  async function handleCreate(send: SendType) {
    if (!title) {
      return setError("Please fill in all fields");
    }

    try {
      const body = { title, locked };

      const json = await send("/api/create-book", body);

      if (json.type !== "SUCCESS") {
        throw new Error(json.msg);
      } else {
        // Add the book to the store
        add(json.data);

        // Close the popup
        closePopup();
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <PopupForm title="Create Book" error={error} submitHandler={handleCreate}>
      <Input
        label="Title"
        value={title}
        setValue={setTitle}
        placeholder="Enter book title"
      />

      <div className="form-wrapper">
        <Checkbox checked={locked} setChecked={setLocked} label="Locked" />
      </div>

      <Submit>Create</Submit>
    </PopupForm>
  );
}
