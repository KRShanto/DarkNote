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
  const router = useRouter();
  const { view, setView } = useViewStore();

  return (
    <nav id="navbar">
      <h1 className="logo">Dark Note</h1>

      <div className="links">
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
