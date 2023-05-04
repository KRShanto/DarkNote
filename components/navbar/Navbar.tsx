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
import { FaBook } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";

import UserImage from "@/public/user-image.png";
import { retrieveFromPath } from "@/lib/notepage";

export default function Navbar() {
  const { data: session } = useSession();
  const { view, setView } = useViewStore(); // TODO

  return (
    <nav id="navbar">
      <Link href="/" className="logo">
        Dark Note
      </Link>

      <div className="links">
        <BackButton />
        <CreateNoteButton />

        {view === "GRID" ? (
          <button
            className="grid-list link"
            onClick={() => setView("LIST")}
            title="List View"
          >
            <FaBars />
          </button>
        ) : (
          <button
            className="grid-list link"
            onClick={() => setView("GRID")}
            title="Grid View"
          >
            <BsGrid3X3Gap />
          </button>
        )}

        <Link href="/settings" title="Settings" className="link">
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
          <button className="btn" onClick={() => signIn()} title="Login">
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
      <Link href="/create-book" title="Create Notebook" className="btn">
        <p>Create Notebook</p>
        <FaBook className="icon" />
      </Link>
    );
  }

  // if the path contains /book, show create note
  else if (router.pathname.includes("/book")) {
    return (
      <Link
        href={`/create-note?id=${router.query.id}`}
        title="Create Note"
        className="btn"
      >
        <p>Create Note</p>
        <FaFileAlt className="icon" />
      </Link>
    );
  }

  // else show nothing
  else {
    return <></>;
  }
}

function BackButton() {
  const router = useRouter();

  // If the path contains /book/, go to home
  if (
    router.pathname.includes("/book/") ||
    router.pathname.includes("/settings") ||
    router.pathname.includes("/profile") ||
    router.pathname.includes("/create-book")
  ) {
    return (
      <Link className="btn" href="/" title="Back">
        Back
      </Link>
    );
  }

  // If the path contains /note/, go to the book page
  else if (router.pathname.includes("/note/")) {
    const { notebookId } = retrieveFromPath(router.asPath);

    return (
      <Link className="btn" href={`/book/${notebookId}`} title="Back">
        Back
      </Link>
    );
  }

  // If the path contains /create-note, go the book page
  else if (router.pathname.includes("/create-note")) {
    const { id } = router.query;

    return (
      <Link className="btn" href={`/book/${id}`} title="Back">
        Back
      </Link>
    );
  }

  // else show nothing
  else {
    return <></>;
  }
}
