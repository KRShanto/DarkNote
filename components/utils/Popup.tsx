import React, { useEffect, useState } from "react";
import { usePopupStore } from "../../stores/popup";
import { FaTimes } from "react-icons/fa";

export default function Popup({
  title,
  crossIcon = true,
  children,
}: {
  title?: string;
  crossIcon: boolean;
  children: React.ReactNode;
}) {
  const [justOpened, setJustOpened] = useState(false);
  const { shouldClose, closePopup, closeActually } = usePopupStore();

  useEffect(() => {
    const id = setTimeout(() => {
      setJustOpened(true);
    }, 100);

    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      if (shouldClose) closeActually();
    }, 400);

    return () => clearTimeout(id);
  }, [shouldClose]);

  return (
    <>
      <div
        id="popup"
        className={shouldClose ? "close" : justOpened ? "open" : ""}
      >
        {title && <h1 className="title">{title}</h1>}

        {crossIcon && (
          <button className="close" onClick={closePopup}>
            <FaTimes />
          </button>
        )}

        {children}
      </div>
    </>
  );
}
