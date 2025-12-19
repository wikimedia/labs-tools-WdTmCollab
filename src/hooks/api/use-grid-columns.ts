"use client";

import { useState, useEffect } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
};

export function useGridColumns() {
  const [columns, setColumns] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.lg) setColumns(4);
      else if (width >= BREAKPOINTS.md) setColumns(3);
      else if (width >= BREAKPOINTS.sm) setColumns(2);
      else setColumns(1);
    };

    updateColumns();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateColumns, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return { columns, isClient };
}