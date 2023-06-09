import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
import Link from "next/link";
import { NoteType } from "@/types/data/note";
import EyeAnimation from "@/public/animations/eye-animation.json";

export default function Note({
  note,
  index,
}: {
  note: NoteType;
  index: number;
}) {
  const router = useRouter();
  const { id } = router.query;

  const [noteOpened, setOpenedNote] = useState(false);

  useEffect(() => {
    if (id === note._id) {
      setOpenedNote(true);
    } else {
      setOpenedNote(false);
    }
  }, [id]);

  return (
    <Link
      href={`/note/${note._id}`}
      scroll={false}
      key={note._id}
      className={`note ${noteOpened ? "open" : ""}`}
    >
      <div className="title-content">
        <div className="title">
          <span className="number">{index + 1}</span>. {note.title}
        </div>

        <div className="content">
          {note.textContent.length > 100
            ? note.textContent.slice(0, 100) + "..."
            : note.textContent}
        </div>
      </div>

      {noteOpened && (
        <Lottie
          className="eye"
          animationData={EyeAnimation}
          loop
          autoplay
          style={{ minWidth: 40, height: 40, marginTop: 10 }}
        />
      )}
    </Link>
  );
}
