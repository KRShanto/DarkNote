import React from "react";
import Lottie from "lottie-react";
import KidNotFoundAnimation from "@/public/animations/kid-not-found.json";

export default function NoNote() {
  return (
    <div className="note-not-found">
      <h1 className="text">Note not found.</h1>

      <Lottie
        animationData={KidNotFoundAnimation}
        className="animation"
        loop={true}
        autoplay={true}
      />

      <p className="tip">
        The note you are looking for does not exist or you do not have access to
        it.
      </p>

      <p className="tip">
        Unlock notebooks on the left to see the notes inside it.
      </p>
    </div>
  );
}
