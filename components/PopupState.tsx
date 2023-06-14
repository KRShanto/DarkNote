import React from "react";
import { usePopupStore } from "@/stores/popup";
import ProtectionKeyForm from "./ProtectionKeyForm";
import CreateNote from "./note/CreateNote";
import CreateBook from "./notebook/CreateBook";
import DeleteNote from "./note/DeleteNote";
import DeleteBook from "./notebook/DeleteBook";
import RenameBook from "./notebook/RenameBook";

export default function PopupState() {
  const { popup } = usePopupStore((state) => state);

  return (
    <>
      {popup === "Unlock" && <ProtectionKeyForm />}
      {popup === "CreateNote" && <CreateNote />}
      {popup === "Createbook" && <CreateBook />}
      {popup === "DeleteNote" && <DeleteNote />}
      {popup === "Deletebook" && <DeleteBook />}
      {popup === "RenameBook" && <RenameBook />}
    </>
  );
}
