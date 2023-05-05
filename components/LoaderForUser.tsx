import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLoadingStore } from "@/stores/loading";

// When the user status is loading, show the loader
// Use this component in _app.tsx
export default function LoaderForUser() {
  const { status } = useSession();
  const { turnOn, turnOff } = useLoadingStore();

  useEffect(() => {
    if (status === "loading") {
      turnOn();
    } else {
      turnOff();
    }
  }, [status]);

  return <></>;
}
