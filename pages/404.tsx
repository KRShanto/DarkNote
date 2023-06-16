import React, { useEffect, useState } from "react";
import NotFound1 from "@/public/animations/not-found-1.json";
import NotFound2 from "@/public/animations/not-found-2.json";
import NotFound3 from "@/public/animations/not-found-3.json";
import NotFound4 from "@/public/animations/not-found-4.json";
import Lottie from "lottie-react";

export default function ErrorPage() {
  //   choose a random animation
  const animations = [NotFound1, NotFound2, NotFound3, NotFound4];
  const [randomAnimation, setRandomAnimation] = useState<any>();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * animations.length);
    setRandomAnimation(animations[randomIndex]);
  }, []);

  return (
    <div className="error-page">
      <Lottie
        animationData={randomAnimation}
        className="animation"
        loop={true}
        autoplay={true}
      />

      <h1 className="text">Page not found.</h1>
      <p className="tip">
        The page you are looking for is not available or does not exist.
      </p>
    </div>
  );
}
