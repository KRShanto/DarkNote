import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { getProtectionTokenById } from "@/lib/session";
import Popup from "../utils/Popup";
import PostButton from "../utils/PostButton";
import { ReturnedJsonType } from "@/types/json";
import { BookWithNotesType } from "@/types/data/booksWithNotes";
import PopupForm from "../utils/PopupForm";
import { SendType } from "../utils/form/Form";
import Input from "../utils/form/Input";
import Submit from "../utils/form/Submit";

export default function RenameBook() {
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [book, setBook] = useState<BookWithNotesType | null>();

  const { books, loading, updateBook } = useBooksWithNotesStore();
  const { data, closePopup } = usePopupStore();

  // find the book
  // and also set the protection token
  useEffect(() => {
    if (!data.id) throw new Error("No book `id` provided in popup data");

    books.forEach((book) => {
      if (book._id === data.id) {
        setBook(book);
        setTitle(book.title);
      }
    });
  }, [data, books]);

  async function handleRename(send: SendType) {
    if (!title) {
      setError("Please enter a title");
      return;
    }

    const protectionToken = getProtectionTokenById(data.id);

    const json = await send("/api/update-book", {
      id: book?._id,
      title,
      protectionToken,
    });

    if (json.type === "SUCCESS") {
      // Update the book in the store
      updateBook(book?._id as string, {
        title,
      });

      // Close the popup
      closePopup();
    } else {
      console.log("Something went worng: ", json);
    }
  }

  if (loading) {
    return (
      <div className="local-spinner">
        <FadeLoader color="cyan" />
      </div>
    );
  }

  return (
    <PopupForm
      submitHandler={handleRename}
      error={error}
      title="Rename Notebook"
    >
      <Input
        label="New title"
        value={title}
        setValue={setTitle}
        placeholder="Enter the new title"
      />

      <Submit>Rename</Submit>
    </PopupForm>
  );
}
