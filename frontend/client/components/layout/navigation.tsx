"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 800) setMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-white">
      <div className="flex justify-between items-center px-6 py-4">
        <ul className="hidden md:flex space-x-6 text-lg font-medium">
          <li>
            <Link
              href="/actors"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Co-Actors/Collabs
            </Link>
          </li>
          <li>
            <Link
              href="/productions"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Shared Casting
            </Link>
          </li>
          <li>
            <Link
              href="/compare"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Cross-project Actors
            </Link>
          </li>
          <li>
            <Link
              href="/clusters"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Clusters
            </Link>
          </li>
        </ul>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-3 border rounded-lg hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <ul
        className={`md:hidden fixed top-30 left-0 w-[98vw] bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <li className="border-b border-gray-200">
          <Link
            href="/actors"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
          >
            Co-Actors/Collabs
          </Link>
        </li>
        <li className="border-b border-gray-200">
          <Link
            href="/productions"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
          >
            Shared Casting
          </Link>
        </li>
        <li className="border-b border-gray-200">
          <Link
            href="/compare"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
          >
            Cross-project Actors
          </Link>
        </li>
        <li>
          <Link
            href="/clusters"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
          >
            Clusters
          </Link>
        </li>
      </ul>
    </nav>
  );
}
