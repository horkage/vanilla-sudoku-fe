"use client"
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Easy-to-style icons
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="w-full bg-white shadow-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left side: Hamburger icon for small screens */}
        <button
          className="sm:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Center: Site title */}
        <h1 className="text-xl font-semibold text-gray-900">Sudoku Narrator</h1>

        {/* Right side: Nav links for desktop */}
        <nav className="hidden sm:flex space-x-4">
          <Link href="/" className="text-gray-700 hover:text-black">Home</Link>
          <Link href="/about" className="text-gray-700 hover:text-black">About</Link>
          <Link href="/videos" className="text-gray-700 hover:text-black">Videos</Link>
        </nav>
      </div>

      {/* Dropdown menu on mobile/tablet */}
      {isOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white px-4 pb-4">
          <Link
            href="/"
            className="block py-2 text-gray-700 hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 text-gray-700 hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/videos"
            className="block py-2 text-gray-700 hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            Videos
          </Link>
        </div>
      )}
    </header>
  );
}

