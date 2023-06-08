import React from "react";

export default function Submit({ children }: { children: React.ReactNode }) {
  return (
    <div className="submit">
      <button type="submit">{children}</button>
    </div>
  );
}
