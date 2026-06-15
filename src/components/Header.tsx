"use client"
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/puzzles", label: "Puzzles" },
  { href: "/videos", label: "Videos" },
  { href: "/create", label: "Create" },
  { href: "/about", label: "About" },
];

// Flat 3x3 favicon-style mark: uniform 1px line weight on every border, no digits.
function GridMark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-[24px] w-[24px] shrink-0 grid-cols-3 grid-rows-3 gap-px rounded-[2px] bg-[#333333] p-px"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="bg-white" />
      ))}
    </span>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-40 border-b border-[#D6CDB6]"
      style={{
        background: "rgba(238,233,218,0.82)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Vanilla Sudoku home">
          <span
            className="text-[22px] font-semibold leading-none tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-[#333333]">Vanilla </span>
            <span className="text-[#6096B4]">Sudoku</span>
          </span>
          <GridMark />
        </Link>

        {/* Desktop links (>= 720px) */}
        <nav
          className="hidden items-center gap-1 min-[720px]:flex"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {links.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  active
                    ? "bg-[var(--difficulty-medium)] text-[#2B2A26]"
                    : "text-[#5C594F] hover:bg-[var(--difficulty-medium)] hover:text-[#2B2A26]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger (< 720px) */}
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#333333] text-[#333333] min-[720px]:hidden"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sheet */}
      {isOpen && (
        <div
          className="border-t border-[#D6CDB6] bg-[#F5F1E6] min-[720px]:hidden"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="block border-b border-[#E3DCC9] px-6 py-4 text-lg font-medium text-[#333333]"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
