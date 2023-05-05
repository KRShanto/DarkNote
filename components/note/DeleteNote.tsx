import { useRouter } from "next/router";
import fetcher from "@/lib/fetcher";

export default function DeleteNote({
  noteId,
  notebookId,
  protectionToken,
  setDeletePopup,
}: {
  noteId: string;
  notebookId: string;
  protectionToken: string;
  setDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  async function handleDelete() {
    const json = await fetcher("/api/delete-note", {
      id: noteId,
      protectionToken,
    });

    console.log(json);

    if (json.type === "SUCCESS") {
      // redirect to notebook page
      router.push(`/book/${notebookId}`);
    } else {
      console.error("ERROR");
      console.error(json);
    }
  }

  return (
    <div className="delete-note">
      <h1 className="text">Are you sure you want to delete this note?</h1>

      <div className="options">
        <button className="btn" onClick={() => setDeletePopup(false)}>
          Cancel
        </button>
        <button className="btn danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
