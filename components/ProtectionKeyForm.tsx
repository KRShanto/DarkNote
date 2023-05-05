import React, { useEffect, useState } from "react";
import { useLoadingStore } from "@/stores/loading";
import fetcher from "@/lib/fetcher";

export default function ProtectionKeyForm({
  path,
  id,
  afterUnlock,
}: {
  path: string;
  id: string;
  afterUnlock: (data: any) => void;
}) {
  const [protectionKey, setProtectionKey] = useState("");
  const [error, setError] = useState("");

  const { turnOn, turnOff } = useLoadingStore();

  async function handleUnlock(e: any) {
    e.preventDefault();

    if (protectionKey.length === 0) {
      setError("No protection key entered");
      return;
    }

    turnOn();
    const json = await fetcher(path, {
      id,
      protectionKey,
    });
    turnOff();

    if (json.type === "SUCCESS") {
      // Call the callback function
      afterUnlock(json.data);
    } else if (json.type === "INVALID") {
      setError("Invalid protection key");
    } else {
      setError("Something went wrong");
    }
  }

  return (
    <form className="protection-key-form" onSubmit={handleUnlock}>
      <h1 className="heading">This notebook is locked</h1>

      {error && <p className="error">{error}</p>}

      <input
        type="password"
        name="protection-key"
        id="protection-key"
        placeholder="Enter protection key"
        value={protectionKey}
        onChange={(e) => setProtectionKey(e.target.value)}
      />

      <button type="submit" className="btn success">
        Unlock
      </button>
    </form>
  );
}
