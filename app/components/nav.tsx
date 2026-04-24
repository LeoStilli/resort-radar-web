"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "../actions/auth";

interface NavProps {
  user: { userId: string; email: string } | null;
}

export default function Nav({ user }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy/95 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            className="text-gold"
          >
            <path
              d="M16 3L4 27h24L16 3z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M10 20l6-7 6 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-semibold tracking-tight text-white">
            Resort Radar
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="/#resorts"
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            Resorts
          </a>
          <a
            href="/#conditions"
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            Conditions
          </a>
          <a
            href="/#features"
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            Features
          </a>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="text-sm font-medium text-white/70 transition hover:text-white"
              >
                Profile
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-white/70 transition hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy transition hover:bg-gold-light"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
