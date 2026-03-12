"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Live Shift", href: "/live-shift" },
  { label: "Debrief", href: "/debrief" },
  { label: "Analytics", href: "/analytics" },
  { label: "Settings", href: "/settings" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-8 h-16 max-w-[1600px] mx-auto">
        <Link href="/dashboard" className="text-xl tracking-tight font-bold text-black dark:text-white flex items-center gap-2">
          DriverPulse
        </Link>
        <nav className="flex items-center gap-8">
          {NAV.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  active
                    ? "text-black dark:text-white font-semibold border-b-2 border-black dark:border-white pb-0.5"
                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="pl-4 border-l border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <a
              href="https://github.com/eshikanahata/Driver-Pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              title="View Source on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
