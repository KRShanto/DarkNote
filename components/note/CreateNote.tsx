import { useState, useEffect } from "react";
import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import { usePopupStore } from "@/stores/popup";
import { useRouter } from "next/router";
import { NoteType } from "@/types/data/note";
import { FadeLoader } from "react-spinners";
import { NotebookType } from "@/types/data/notebook";
import Popup from "../utils/Popup";
import PopupForm from "../utils/PopupForm";
import Input from "../utils/form/Input";
import Submit from "../utils/form/Submit";
import { SendType } from "../utils/form/Form";
import { getProtectionTokenById } from "@/lib/session";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [notebook, setNotebook] = useState<NotebookType>();

  const { books, loading, addNote } = useBooksWithNotesStore();
  const { data, closePopup } = usePopupStore();
  // const { id } = data as { id: string };
  const router = useRouter();

  useEffect(() => {
    // find the notebook from the books
    books.forEach((book) => {
      if (book._id === data.id && book.unlocked === true) {
        setNotebook(book);
      }
    });
  }, [data, books]);

  async function handleCreate(send: SendType) {
    if (!title) {
      return setError("Please fill in all fields");
    }

    const protectionToken = getProtectionTokenById(notebook?._id as string);

    const json = await send("/api/create-note", {
      id: notebook?._id,
      title,
      protectionToken,
    });

    if (json.type === "SUCCESS") {
      // Add the note to the store
      addNote(notebook?._id as string, json.data);

      // redirect to notebook page
      router.push(`/note/${json.data._id}?edit=true`);

      // Close the popup
      closePopup();
    } else {
      setError("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="local-spinner">
        <FadeLoader color="cyan" />
      </div>
    );
  }

  // Choose which notebook to create the note in
  if (!notebook) {
    return (
      <Popup crossIcon title="Choose a notebook">
        <div className="book-choose">
          <p className="tip">Choose a notebook to create the note in.</p>
          <p className="tip">Locked notebooks are not shown.</p>
          <div className="books">
            {books.map((book) => {
              if (book.unlocked !== true) {
                return null;
              }

              return (
                <div
                  key={book._id}
                  className="book"
                  onClick={() => setNotebook(book)}
                >
                  <p className="book-title">{book.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Popup>
    );
  }

  return (
    <PopupForm
      submitHandler={handleCreate}
      className="create-note-form"
      title="Create a note"
      error={error}
    >
      <Input
        label="Note title"
        value={title}
        setValue={setTitle}
        placeholder="Enter note title"
      />

      <Submit>Create</Submit>
    </PopupForm>
  );
}
