import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SignupForm } from "./_components/SignupForm";

export const metadata: Metadata = { title: "Create Account — Resort Radar" };

export default function SignupPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-navy p-12 lg:flex">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          alt="Mountain panorama"
          fill className="object-cover opacity-40" sizes="50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/60 to-navy/30" />
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-gold">
            <path d="M16 3L4 27h24L16 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M10 20l6-7 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-semibold tracking-tight text-white">Resort Radar</span>
        </Link>
        <div className="relative z-10 space-y-4">
          <p className="text-sm font-semibold tracking-wide text-gold uppercase">What you&apos;ll get</p>
          {[
            "Live snow & conditions across 2,800+ resorts",
            "Powder alerts when your mountains drop fresh",
            "AI-powered resort matching to your skill level",
            "Personalised recommendations",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <svg viewBox="0 0 16 16" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-gold">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm text-white/70">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-cream px-6 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-navy">
            <path d="M16 3L4 27h24L16 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M10 20l6-7 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span className="text-lg font-semibold tracking-tight text-navy">Resort Radar</span>
        </Link>
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
            <p className="mt-1.5 text-sm text-foreground/50">Start tracking conditions at your favourite mountains.</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
