"use client";

import dynamic from "next/dynamic";
import type { MapResort } from "./resort-map";

const ResortMap = dynamic(() => import("./resort-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-navy-light">
      <p className="text-sm text-white/40">Loading map…</p>
    </div>
  ),
});

export default function ResortMapLoader({ resorts }: { resorts: MapResort[] }) {
  return <ResortMap resorts={resorts} />;
}
