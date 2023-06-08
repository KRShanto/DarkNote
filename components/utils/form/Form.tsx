import React, { useContext } from "react";
import { ReturnedJsonType } from "../../../types/json";
import { useLoadingStore } from "@/stores/loading";

export type SendType = (path: string, body: any) => Promise<ReturnedJsonType>;

export default function Form({
  className,
  submitHandler,
  children,
}: {
  className?: string;
  submitHandler: (send: SendType) => void;
  children: React.ReactNode;
}) {
  const turnOn = useLoadingStore((state) => state.turnOn);
  const turnOff = useLoadingStore((state) => state.turnOff);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    submitHandler(async (path: string, body: any) => {
      turnOn();

      const res = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      turnOff();

      const json = await res.json();
      return json;
    });
  };

  return (
    <form action="#" onSubmit={handleSubmit} className={`form ${className}`}>
      {children}
    </form>
  );
}
