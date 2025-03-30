"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Loading() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(); // Détecte les changements de page
  useEffect(() => {
    setLoading(true); // Active le loader au changement d'URL

    const timeout = setTimeout(() => {
      setLoading(false); // Désactive le loader après 1 seconde
    }, 2000);

    return () => clearTimeout(timeout); // Nettoyage du timeout
  }, [pathname]);
  if (!loading) return null; // Cache le loader si pas en chargement
  // Or a custom loading skeleton component
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
