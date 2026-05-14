"use client";

import dynamic from "next/dynamic";
import type { MapResort } from "./ResortMap";

const ResortMapDynamic = dynamic(
  () => import("./ResortMap").then((m) => ({ default: m.ResortMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-navy-light">
        <p className="text-sm text-white/40">Loading map…</p>
      </div>
    ),
  }
);

export function ResortMapLoader({ resorts }: { resorts: MapResort[] }) {
  return <ResortMapDynamic resorts={resorts} />;
}
