import React from "react";
import DisplayBooks from "./notebook/DisplayBooks";
import { useSession, signIn, signOut } from "next-auth/react";
import DisplayNote from "./note/DisplayNote";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <div id="home">{/* <DisplayNote /> */}</div>
    </>
  );
}
