"use client";

import { useEffect, useRef } from "react";
import { markPostRead } from "./actions";

export default function ReadTracker({
  postId,
}: {
  postId: string;
}) {
  const hasMarked = useRef(false);

  useEffect(() => {
    function checkScroll() {
      if (hasMarked.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrollPercent =
        (scrollTop + windowHeight) / documentHeight;

      if (scrollPercent >= 0.7) {
        hasMarked.current = true;
        markPostRead(postId);
      }
    }

    window.addEventListener("scroll", checkScroll);

    checkScroll();

    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, [postId]);

  return null;
}