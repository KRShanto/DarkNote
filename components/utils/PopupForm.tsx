import React from "react";
import Popup from "./Popup";
import Form from "./form/Form";
import { SendType } from "./form/Form";

export default function PopupForm({
  title,
  error,
  className,
  submitHandler,
  children,
  crossIcon = true,
}: {
  title?: string;
  error?: string;
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
      <Form
        submitHandler={handleSubmit}
        className={className}
        error={error}
        title={title}
      >
        {children}
      </Form>
    </Popup>
  );
}
