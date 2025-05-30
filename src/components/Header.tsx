"use client"
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Easy-to-style icons
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header className="bg-[#6096B4] px-4 py-3 shadow-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Left side: Hamburger icon for small screens */}
          <button
            className="sm:hidden text-[#EEE9DA] focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Center: Site title */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#EEE9DA]">Vanilla Sudoku</h1>
            <img
              src="/images/vs-icon.png"
              alt="Vanilla Sudoku icon"
              className="h-6 w-6"
            />
          </div>

          {/* Right side: Nav links for desktop */}
          <nav className="hidden sm:flex space-x-6 text-[#EEE9DA]">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/videos", label: "Videos" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-bold px-3 py-1 rounded-full transition-all duration-300 ease-in-out hover:bg-[#EEE9DA] hover:text-[#93BFCF]"
            >
              {label}
            </Link>
          ))}
          </nav>
        </div>
      </header>

      {/* Dropdown menu on mobile/tablet */}
      {isOpen && (
        <div className="absolute top-full z-50 w-full bg-[#93BFCF] border-t border-[#333333] md:hidden">
          <nav className="flex flex-col text-[#333333] font-semibold max-w-5xl mx-auto">
            <Link href="/about" onClick={() => setIsOpen(false)} className="py-3 px-4 border-b border-[#333333]">About</Link>
            <Link href="/videos" onClick={() => setIsOpen(false)} className="py-3 px-4 border-b border-[#333333]">Videos</Link>
            <Link href="/puzzles/easy" onClick={() => setIsOpen(false)} className="py-3 px-4 border-b border-[#333333]">Puzzles</Link>
          </nav>
        </div>
      )}
    </>
  );
}

