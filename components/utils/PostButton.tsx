import React, { useContext } from "react";
import { ReturnedJsonType } from "../../types/json";
import { useLoadingStore } from "@/stores/loading";

export default function PostButton({
  path,
  body,
  afterPost,
  children,
  className,
  id,
  extra,
}: {
  path: string;
  body: any;
  afterPost: (json: ReturnedJsonType, body: any) => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
  extra?: any;
}) {
  const turnOn = useLoadingStore((state) => state.turnOn);
  const turnOff = useLoadingStore((state) => state.turnOff);

  const handleClick = async () => {
    turnOn();

    const res = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    afterPost(json, body);

    turnOff();
  };

  return (
    <button onClick={handleClick} {...extra} className={className} id={id}>
      {children}
    </button>
  );
}
