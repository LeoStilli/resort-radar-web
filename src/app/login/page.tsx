import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./_components/LoginForm";

export const metadata: Metadata = { title: "Sign In — Resort Radar" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-navy p-12 lg:flex">
        <Image
          src="https://images.unsplash.com/photo-1502126324834-38f8e02d7160?w=1200&q=80"
          alt="Mountain at dawn"
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
        <div className="relative z-10">
          <blockquote className="text-2xl leading-relaxed font-light text-white/90">
            &ldquo;The mountain doesn&apos;t care about your plans. Go where the snow is.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-white/40">— Resort Radar</p>
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-1.5 text-sm text-foreground/50">Sign in to access your resorts and conditions.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
