import React from "react";
import { usePopupStore } from "@/stores/popup";
import ProtectionKeyForm from "./ProtectionKeyForm";

export default function PopupState() {
  const { popup } = usePopupStore((state) => state);

  return <>{popup === "Unlock" && <ProtectionKeyForm />}</>;
}
