"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#api-daas", label: "Data Sources" },
  { href: "#industrias", label: "Industrias" },
  { href: "#compliance", label: "Compliance Ley 21.719" },
  { href: "#poc", label: "PoC / Demo" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-base-950/85 backdrop-blur-lg border-b border-base-700/70"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <span className="h-6 w-6 rounded-sm bg-amber/15 border border-amber/40 flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-amber animate-pulse-slow" />
          </span>
          <span className="font-display font-medium tracking-tight text-base-50 uppercase text-[15px]">
            My Little Data Company
          </span>
          <span className="hidden sm:inline-flex items-center rounded-sm border border-base-600 bg-base-800/80 px-2 py-0.5 text-[11px] font-mono text-base-300">
            Boutique Data Studio &amp; DaaS
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-base-300 hover:text-base-50 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a
            href="#poc"
            className="inline-flex items-center rounded-sm bg-amber px-4 py-2 text-sm font-semibold text-base-950 hover:bg-amber-bright transition-colors glow"
          >
            Agendar Demo PoC
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          className="lg:hidden text-base-200 p-2 -mr-2"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-base-700/70 bg-base-950/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-base-300 hover:text-base-50 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#poc"
            onClick={() => setOpen(false)}
            className="inline-flex justify-center items-center rounded-sm bg-amber px-4 py-2.5 text-sm font-semibold text-base-950 mt-1"
          >
            Agendar Demo PoC
          </a>
        </div>
      )}
    </header>
  );
}
