import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { getProtectionTokenById } from "@/lib/session";
import Popup from "../utils/Popup";
import PostButton from "../utils/PostButton";
import { ReturnedJsonType } from "@/types/json";
import { BookWithNotesType } from "@/types/data/booksWithNotes";

// TODO take passwords before locking notebooks
export default function ChangeLock() {
  const [book, setBook] = useState<BookWithNotesType | null>();
  const [protectionToken, setProtectionToken] = useState<string>("");

  const { books, loading, updateBook } = useBooksWithNotesStore();
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

  function afterChangingLock(json: ReturnedJsonType) {
    if (json.type === "SUCCESS") {
      // Update the book
      updateBook(book?._id as string, {
        locked: !book?.locked,
      });

      console.log("AFter books: ", books);

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
    <Popup
      title={
        book?.locked
          ? "Unlock Notebook Parmanently"
          : "Lock Notebook Parmanently"
      }
      crossIcon
    >
      <p className="tip">
        Are you sure you want to parmanently {book?.locked ? "unlock" : "lock"}{" "}
        this notebook <b>{book?.title}</b>
      </p>
      {!book?.locked && (
        <p className="tip">
          After locking this notebook, you need to enter passwords everytime to
          view this book.
        </p>
      )}

      <PostButton
        path="/api/update-book"
        body={{
          id: book?._id,
          protectionToken,
          locked: !book?.locked,
        }}
        afterPost={afterChangingLock}
        className="btn sky"
      >
        {book?.locked ? "Unlock" : "Lock"}
      </PostButton>
    </Popup>
  );
}
