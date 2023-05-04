import React from "react";
import DisplayBooks from "./notebook/DisplayBooks";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <div id="home">
        {status === "authenticated" && <DisplayBooks />}

        {status === "unauthenticated" && (
          <div>The best note editor</div> // TODO: intro
        )}
      </div>
    </>
  );
}
