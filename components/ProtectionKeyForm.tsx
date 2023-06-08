import React, { useState } from "react";
import PopupForm from "./utils/PopupForm";
import { SendType } from "./utils/form/Form";
import Input from "./utils/form/Input";
import { usePopupStore } from "../stores/popup";
import Submit from "./utils/form/Submit";

interface ProtectionKeyData {
  path: string;
  id: string;
  afterUnlock: (data: any) => void;
}

export default function ProtectionKeyForm() {
  const [protectionKey, setProtectionKey] = useState("");
  const [error, setError] = useState("");

  const { data, closePopup } = usePopupStore((state) => state);
  const { path, id, afterUnlock } = data as ProtectionKeyData;

  if (!path || !id || !afterUnlock) throw new Error("Invalid popup data!");

  async function handleUnlock(send: SendType) {
    if (protectionKey.length === 0) {
      setError("No protection key entered");
      return;
    }

    const json = await send(path, {
      id,
      protectionKey,
    });

    if (json.type === "SUCCESS") {
      // Call the callback function
      afterUnlock(json.data);
      closePopup();
    } else if (json.type === "INVALID") {
      setError("Invalid protection key");
    } else {
      setError("Something went wrong");
    }
  }

  return (
    <PopupForm
      className="protection-key-form"
      submitHandler={handleUnlock}
      crossIcon={true}
    >
      <h1 className="heading">This notebook is locked</h1>

      {error && <p className="error">{error}</p>}

      <Input
        type="password"
        placeholder="Enter protection key"
        value={protectionKey}
        setValue={setProtectionKey}
        label="Protection Key"
      />

      <Submit>Unlock</Submit>
    </PopupForm>
  );
}
