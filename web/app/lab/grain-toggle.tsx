"use client";

import { useEffect, useState } from "react";

export function GrainToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.grain = enabled ? "on" : "off";
  }, [enabled]);

  useEffect(() => {
    const root = document.documentElement;
    const updateOverflowState = () => {
      root.dataset.horizontalOverflow = String(
        root.scrollWidth > root.clientWidth + 1,
      );
    };

    updateOverflowState();
    window.addEventListener("resize", updateOverflowState);

    return () => window.removeEventListener("resize", updateOverflowState);
  }, []);

  return (
    <button
      aria-pressed={enabled}
      className="tessli-control"
      onClick={() => setEnabled((current) => !current)}
      type="button"
    >
      Grain {enabled ? "on" : "off"}
    </button>
  );
}
