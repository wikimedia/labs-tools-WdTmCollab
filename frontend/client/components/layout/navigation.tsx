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
    <nav>
      <div className="flex justify-between items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 border border-white rounded"
        >
          {menuOpen ? (
            <svg
              height="24"
              width="24"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M420.48 121.813L390.187 91.52L256 225.92L121.813 91.52L91.52 121.813L225.92 256L91.52 390.187l30.293 30.293L256 286.08l134.187 134.4l30.293-30.293L286.08 256z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.75 4.75h18.5M2.75 12h18.5m-18.5 7.25h18.5"
                fill="Black"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </button>
      </div>
      <ul
        className={`mt-4 space-y-2 md:space-y-0 md:flex md:gap-6 md:items-center ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <li>
          <Link
            href="/actors"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Actors
          </Link>
        </li>
        <li>
          <Link
            href="/productions"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Productions
          </Link>
        </li>
        <li>
          <Link
            href="/compare"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Compare
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
