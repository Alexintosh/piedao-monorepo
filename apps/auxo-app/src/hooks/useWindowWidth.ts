import { useEffect, useState } from "react";

export const useWindowWide = (size: number): boolean => {
  /**
   * Fetch window size dynamically
   */
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // SSR
    if (typeof window === "undefined") return;

    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setWidth]);
  return width > size;
};
