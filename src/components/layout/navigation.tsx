"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  //close mobile menu on window resize if screen become larger

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav aria-label='Main navigation' className='hidden md:flex'>
        <ul className='flex space-x-6' role='list'>
          <li>
            <Link
              href='/actors'
              className='text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1'
              aria-label='View co-actors and collaborators'
            >
              Find Collaborators
            </Link>
          </li>
          <li>
            <Link
              href='/productions'
              className='text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1'
              aria-label='View shared productions'
            >
              Shared Productions
            </Link>
          </li>
          <li>
            <Link
              href='/compare'
              className='text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1'
              aria-label='Compare cross-project actors'
            >
              Compare Actors
            </Link>
          </li>
        </ul>
      </nav>
      {/* Mobile Nav */}
      <div className='md:hidden'>
        <button
          onClick={toggleMobileMenu}
          className='p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all duration-200'
          aria-label='Toggle navigation menu'
          aria-expanded={isMobileMenuOpen}
          aria-controls='mobile-menu'
        >
          <svg
            className='h-6 w-6 transition-all duration-300 ease-in-out'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            aria-hidden='true'
          >
            {isMobileMenuOpen ? (
              // X icon when menu is open
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
                className='stroke-blue-600'
              />
            ) : (
              // Hamburger icon when menu is closed
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2.5}
                d='M4 6h16M4 12h16M4 18h16'
                className='stroke-gray-700'
              />
            )}
          </svg>
        </button>
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            id='mobile-menu'
            className='fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 overflow-hidden'
            style={{
              transform: isMobileMenuOpen
                ? "translateX(0)"
                : "translateX(100%)",
              transition: "transform 2.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
              height: "340px",
              maxWidth: "224px"
            }}
          >
            <div className='flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50'>
              <button
                onClick={closeMobileMenu}
                className='p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/50 transition-all duration-200'
                aria-label='Close navigation menu'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <nav aria-label='Mobile navigation' className='p-4'>
              <ul role='list' className='space-y-2'>
                <li>
                  <Link
                    href='/actors'
                    onClick={closeMobileMenu}
                    className='block items-center px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-b border-gray-300'
                    aria-label='View co-actors and collaborators'
                  >
                    <div className='font-medium text-base'>
                      Find Collaborators
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    href='/productions'
                    onClick={closeMobileMenu}
                    className='block items-center px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-b border-gray-300'
                    aria-label='View shared productions'
                  >
                    <div className='font-medium text-base'>
                      Shared Productions
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    href='/compare'
                    onClick={closeMobileMenu}
                    className='block items-center px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-b border-gray-300'
                    aria-label='Compare cross-project actors'
                  >
                    <div className='flex-1'>
                      <div className='font-medium text-base'>
                        Compare Actors
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
