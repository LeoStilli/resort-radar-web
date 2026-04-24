"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "@/actions/auth";

export default function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signup,
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
        <label htmlFor="name" className="text-sm font-medium text-foreground/70">Full name</label>
        <input
          id="name" name="name" type="text" autoComplete="name" required
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-foreground/30 focus:border-navy focus:ring-2 focus:ring-navy/10"
          placeholder="Alex Rider"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground/70">Email address</label>
        <input
          id="email" name="email" type="email" autoComplete="email" required
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-foreground/30 focus:border-navy focus:ring-2 focus:ring-navy/10"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground/70">Password</label>
        <input
          id="password" name="password" type="password" autoComplete="new-password" required minLength={8}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-foreground/30 focus:border-navy focus:ring-2 focus:ring-navy/10"
          placeholder="Min. 8 characters"
        />
      </div>

      <button
        type="submit" disabled={pending}
        className="mt-1 rounded-full bg-navy py-3.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-center text-sm text-foreground/50">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-gold transition hover:text-gold-light">
          Sign in
        </Link>
      </p>
    </form>
  );
}
