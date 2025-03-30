"use client";
import React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

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
    <>
      <div className="flex items-center gap-4">
        <nav className="relative">
          <div className="flex justify-between items-center gap-x-1 w-full">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
          <div className="hidden md:flex md:gap-6">
            <Link
              href="/actors"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Actors
            </Link>
            <Link
              href="/productions"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Productions
            </Link>
            <Link
              href="/compare"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Compare
            </Link>
            <Link
              href="/clusters"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              Clusters
            </Link>
          </div>
          <ul
            className={`absolute top-full right-0 w-[93vw] bg-white shadow-lg rounded-lg transition-all duration-500 overflow-hidden ${
              menuOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-2 invisible"
            } md:hidden`}
          >
            <div className="p-2 space-y-2">
              <li>
                <Link
                  href="/actors"
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Actors
                </Link>
              </li>
              <li>
                <Link
                  href="/productions"
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Productions
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Compare
                </Link>
              </li>
              <li>
                <Link
                  href="/clusters"
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Clusters
                </Link>
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </>
  );
}
    <nav>
      <ul className="flex space-x-6">
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
    </nav>
  );
}

