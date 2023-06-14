import { useRouter } from "next/router";
import fetcher from "@/lib/fetcher";
import { useLoadingStore } from "@/stores/loading";

export default function DeleteBook({
  id,
  protectionToken,
  setDeletePopup,
}: {
  id: string;
  protectionToken: string;
  setDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { turnOn, turnOff } = useLoadingStore();

  console.log("protectionToken", protectionToken);

  async function handleDelete() {
    turnOn();
    const json = await fetcher("/api/delete-book", {
      id,
      protectionToken,
    });
    turnOff();

    if (json.type === "SUCCESS") {
      // redirect to home page
      router.push(`/`);
    } else {
      console.error("ERROR");
      console.error(json);
    }
  }

  return (
    <div className="delete-note confirm">
      <h1 style={{ color: "rgb(255, 0, 0)" }} className="heading">
        Are you sure you want to delete this notebook?
      </h1>

      <p className="text">
        All your notes under this book will be deleted as well.
      </p>

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
