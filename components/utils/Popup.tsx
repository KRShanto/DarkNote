import React, { useEffect, useState } from "react";
import { usePopupStore } from "../../stores/popup";
import { FaTimes } from "react-icons/fa";

export default function Popup({
  crossIcon = true,
  children,
}: {
  crossIcon: boolean;
  children: React.ReactNode;
}) {
  const [justOpened, setJustOpened] = useState(false);
  const { shouldClose, closePopup, closeActually } = usePopupStore(
    (state) => state
  );

  useEffect(() => {
    setJustOpened(true);
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
