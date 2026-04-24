"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground/70">
          Email address
        </label>
        <input
          id="email" name="email" type="email" autoComplete="email" required
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-foreground/30 focus:border-navy focus:ring-2 focus:ring-navy/10"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-foreground/70">
            Password
          </label>
          <a href="#" className="text-xs text-gold transition hover:text-gold-light">
            Forgot password?
          </a>
        </div>
        <input
          id="password" name="password" type="password" autoComplete="current-password" required
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-foreground/30 focus:border-navy focus:ring-2 focus:ring-navy/10"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit" disabled={pending}
        className="mt-1 rounded-full bg-navy py-3.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-sm text-foreground/50">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-gold transition hover:text-gold-light">
          Create one
        </Link>
      </p>
    </form>
  );
}
