"use client";

import { useEffect } from "react";

export function ViewportOverflowProbe() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      root.dataset.horizontalOverflow = String(
        root.scrollWidth > root.clientWidth + 1,
      );
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(root);
    observer.observe(document.body);
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return null;
}
