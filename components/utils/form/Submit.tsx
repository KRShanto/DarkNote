import React from "react";

export default function Submit({ children }: { children: React.ReactNode }) {
  return (
    <div className="submit">
      <button type="submit" className="btn sky">
        {children}
      </button>
    </div>
  );
}
