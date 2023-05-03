import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import fetcher from "@/lib/fetcher";
import { NoteType } from "@/types/data/note";
import {
  addNotebookProtectionToken,
  getNotebookProtectionTokenById,
} from "@/lib/session";

export default function DisplayNotes() {
  const router = useRouter();
  const { id } = router.query;

  const [needToUnlock, setNeedToUnlock] = useState(false);
  const [protectionKey, setProtectionKey] = useState("");
  const [notes, setNotes] = useState<NoteType[]>([]);

  async function handleUnlock() {
    if (protectionKey.length === 0) {
      console.log("No protection key entered");
      return;
    }

    const json = await fetcher(`/api/unlock-notebook-and-get`, {
      id,
      protectionKey,
    });

    console.log(json);

    if (json.type === "SUCCESS") {
      // Save the `protectionToken` to the session storage
      // sessionStorage.setItem("protectionToken", json.data);
      // sessionStorage.setItem("protectionToken", json.data.protectionToken);
      addNotebookProtectionToken(id as string, json.data.protectionToken);
      setNotes(json.data.notes);
      setNeedToUnlock(false);
    } else if (json.type === "INVALID") {
      console.log("Invalid protection key");
    } else {
      console.error("ERROR");
    }
  }

  useEffect(() => {
    async function getNotes() {
      // const res = await fetcher(`/api/get-notes`, {
      //   id: id,

      // });

      // Get the `protectionToken` from the session storage
      // const protectionToken = sessionStorage.getItem("protectionToken");
      const protectionToken = getNotebookProtectionTokenById(id as string);

      console.log(protectionToken);

      const json = await fetcher(`/api/get-notes`, {
        id: id,
        protectionToken: protectionToken,
      });

      console.log(json);

      if (json.type === "SUCCESS") {
        setNotes(json.data);
      } else if (json.type === "LOCKED") {
        setNeedToUnlock(true);
      } else {
        console.error("ERROR");
      }
    }

    if (id) getNotes();
  }, [id]);

  return (
    <div>
      {needToUnlock ? (
        <div>
          <label htmlFor="protectionKey">
            This note is protected. Please enter the protection key to unlock
            it.
          </label>
          <input
            type="text"
            name="protectionKey"
            id="protectionKey"
            value={protectionKey}
            onChange={(e) => setProtectionKey(e.target.value)}
          />
          <button onClick={handleUnlock} disabled={protectionKey.length === 0}>
            Unlock
          </button>
        </div>
      ) : (
        <div>
          {notes.map((note) => (
            <div key={note._id}>
              <h1>{note.title}</h1>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
