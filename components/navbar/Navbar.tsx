import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { useViewStore } from "@/stores/view";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

// icons
import { FaBars } from "react-icons/fa";
import { BsGrid3X3Gap } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";

import UserImage from "@/public/user-image.png";

export default function Navbar() {
  const { data: session } = useSession();
  const { view, setView } = useViewStore();

  return (
    <nav id="navbar">
      <Link href="/" className="logo">
        Dark Note
      </Link>

      <div className="links">
        <CreateNoteButton />

        {view === "GRID" ? (
          <button
            className="grid-list"
            onClick={() => setView("LIST")}
            title="List View"
          >
            <FaBars />
          </button>
        ) : (
          <button
            className="grid-list"
            onClick={() => setView("GRID")}
            title="Grid View"
          >
            <BsGrid3X3Gap />
          </button>
        )}

        <Link href="/settings" title="Settings">
          <AiOutlineSetting />
        </Link>

        {session ? (
          <Link href="/profile" title="Profile" className="profile">
            {session.user?.image ? (
              <Image
                src={session.user?.image || ""}
                alt="Profile Picture"
                width={50}
                height={50}
                className="profile-image"
              />
            ) : (
              <Image
                src={UserImage}
                alt="Profile Picture"
                width={50}
                height={50}
                className="profile-image"
              />
            )}
          </Link>
        ) : (
          <button className="login" onClick={() => signIn()} title="Login">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

function CreateNoteButton() {
  const router = useRouter();

  // if its home page, show create notebook
  if (router.pathname === "/") {
    return (
      <Link
        href="/create-book"
        title="Create Notebook"
        className="create-button"
      >
        Create Notebook
      </Link>
    );
  }

  // if the path contains /book, show create note
  else if (router.pathname.includes("/book")) {
    return (
      <Link
        href={`/create-note?book=${router.query.id}`}
        title="Create Note"
        className="create-button"
      >
        Create Note
      </Link>
    );
  }

  // else show nothing
  else {
    return <></>;
  }
}
