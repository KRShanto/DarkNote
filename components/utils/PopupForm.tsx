import React from "react";
import Popup from "./Popup";
import Form from "./form/Form";
import { SendType } from "./form/Form";

export default function PopupForm({
  className,
  submitHandler,
  children,
  crossIcon = true,
}: {
  className?: string;
  submitHandler: (send: SendType) => void;
  children: React.ReactNode;
  crossIcon?: boolean;
}) {
  const handleSubmit = async (send: SendType) => {
    submitHandler(send);
  };

  return (
    <Popup crossIcon={crossIcon}>
      <Form submitHandler={handleSubmit} className={className}>
        {children}
      </Form>
    </Popup>
  );
}
