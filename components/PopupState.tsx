import React from "react";
import { usePopupStore } from "@/stores/popup";
import ProtectionKeyForm from "./ProtectionKeyForm";
import CreateNote from "./note/CreateNote";
import CreateBook from "./notebook/CreateBook";

export default function PopupState() {
  const { popup } = usePopupStore((state) => state);

  return (
    <>
      {popup === "Unlock" && <ProtectionKeyForm />}
      {popup === "CreateNote" && <CreateNote />}
      {popup === "CreateNotebook" && <CreateBook />}
    </>
  );
}
