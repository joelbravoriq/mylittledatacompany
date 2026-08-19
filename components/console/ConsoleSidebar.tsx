"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/console",
    label: "General Health",
    icon: (
      <path d="M3 3v18h18M7 15l4-6 3 4 5-8" />
    ),
  },
  {
    href: "/console/clients",
    label: "Clientes & Tenancy",
    icon: (
      <>
        <path d="M3 21V8l9-5 9 5v13" />
        <path d="M9 21v-7h6v7M9 12h.01M15 12h.01M9 8h.01M15 8h.01" />
      </>
    ),
  },
  {
    href: "/console/sources",
    label: "Data Sources & Pipelines",
    icon: (
      <path d="M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2Zm0 0v12c0 1.1 3.6 2 8 2s8-.9 8-2V6M4 12c0 1.1 3.6 2 8 2s8-.9 8-2" />
    ),
  },
  {
    href: "/console/bridge",
    label: "Bridge Engine (Zero-Storage)",
    icon: (
      <>
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        <path d="M8 12h8" />
      </>
    ),
  },
  {
    href: "/console/sandbox",
    label: "PoC Sandbox",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" />
      </>
    ),
  },
  {
    href: "/console/compliance",
    label: "Compliance & Ley 21.719",
    icon: (
      <path d="M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-4Z" />
    ),
  },
  {
    href: "/console/settings",
    label: "API Keys & Billing",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </>
    ),
  },
];

export default function ConsoleSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-base-800 bg-base-900/60 flex flex-col">
      <div className="px-5 py-6 border-b border-base-800">
        <Link href="/console" className="flex items-center gap-2.5">
          <span className="h-6 w-6 rounded-sm bg-amber/15 border border-amber/40 flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-amber" />
          </span>
          <span className="font-display font-medium uppercase tracking-tight text-base-50 text-[13px] leading-tight">
            My Little
            <br />
            Data Company
          </span>
        </Link>
        <span className="mt-3 inline-flex items-center rounded-sm border border-base-600 bg-base-800/80 px-2 py-0.5 text-[10px] font-mono text-base-300">
          Admin Portal &middot; v1.0 PoC
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-amber/10 text-amber-bright border border-amber/25"
                  : "text-base-300 hover:text-base-50 hover:bg-base-800/60 border border-transparent"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                {l.icon}
              </svg>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-base-800">
        <Link
          href="/"
          className="text-xs text-base-400 hover:text-base-100 transition-colors"
        >
          &larr; Volver al sitio público
        </Link>
      </div>
    </aside>
  );
}
