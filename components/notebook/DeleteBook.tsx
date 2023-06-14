import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import { NoteType } from "@/types/data/note";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { SendType } from "../utils/form/Form";
import { getProtectionTokenById } from "@/lib/session";
import Popup from "../utils/Popup";
import PostButton from "../utils/PostButton";
import { ReturnedJsonType } from "@/types/json";
import { BookWithNotesType } from "@/types/data/booksWithNotes";

export default function DeleteBook() {
  const [book, setBook] = useState<BookWithNotesType | null>();
  const [protectionToken, setProtectionToken] = useState<string>("");

  const { books, loading, deleteBook } = useBooksWithNotesStore();
  const { data, closePopup } = usePopupStore();

  // find the book
  // and also set the protection token
  useEffect(() => {
    if (!data.id) throw new Error("No book `id` provided in popup data");

    books.forEach((book) => {
      if (book._id === data.id) {
        setBook(book);
      }
    });

    const protectionToken = getProtectionTokenById(data.id);

    setProtectionToken(protectionToken as string);
  }, [data, books]);

  function afterDelete(json: ReturnedJsonType) {
    if (json.type === "SUCCESS") {
      // Delete the note from the store
      deleteBook(book?._id as string);

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
    <Popup crossIcon title="Delete Notebook">
      <p className="tip">
        Are you sure you want to delete this notebook <b>{book?.title}</b>
      </p>

      <PostButton
        path="/api/delete-book"
        body={{
          id: book?._id,
          protectionToken,
        }}
        afterPost={afterDelete}
        className="btn danger"
      >
        Delete
      </PostButton>
    </Popup>
  );
}
