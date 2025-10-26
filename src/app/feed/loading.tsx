"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Loading() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(); // Détecte les changements de page
  useEffect(() => {
    setLoading(true); // Active le loader au changement d'URL

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [pathname]);
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
