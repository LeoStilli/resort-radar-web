"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapResort {
  id: string;
  name: string;
  location: string;
  lat: number;
  lon: number;
  trails: number;
  vertical: string;
  weather: {
    tempF: number;
    snowDepthFt: number;
    snowfallTodayIn: number;
    condition: string;
    overallCondition: string | null;
    liftsOpen: number | null;
    liftsTotal: number | null;
    runsOpen: number | null;
    runsTotal: number | null;
  } | null;
}

// Fix Leaflet's broken default icon in webpack/Next.js
function FixLeafletIcons() {
  const map = useMap();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
    map.invalidateSize();
  }, [map]);
  return null;
}

function ResortMarker({ resort }: { resort: MapResort }) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require("leaflet");
  const icon = L.divIcon({
    className: "",
    html: `<div style="
      background: #0c1a2a;
      border: 2px solid #c9a84c;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
      cursor: pointer;
    ">
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
        <path d="M16 3L4 27h24L16 3z" stroke="#c9a84c" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M10 20l6-7 6 7" stroke="#c9a84c" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -38],
  });

  const pos: LatLngTuple = [resort.lat, resort.lon];
  const w = resort.weather;

  return (
    <Marker position={pos} icon={icon}>
      <Popup className="resort-popup" maxWidth={220}>
        <div style={{ fontFamily: "system-ui, sans-serif", padding: "4px 0" }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: "#0c1a2a", marginBottom: 2 }}>
            {resort.name}
          </p>
          <p style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>{resort.location}</p>
          {w ? (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                <div>
                  <p style={{ fontSize: 10, color: "#aaa" }}>Condition</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0c1a2a" }}>{w.overallCondition ?? w.condition}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#aaa" }}>Temp</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0c1a2a" }}>{w.tempF}°F</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                <div>
                  <p style={{ fontSize: 10, color: "#aaa" }}>Snow Depth</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0c1a2a" }}>
                    {w.snowDepthFt > 0 ? `${w.snowDepthFt} ft` : "—"}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#aaa" }}>New Today</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0c1a2a" }}>
                    {w.snowfallTodayIn > 0 ? `${w.snowfallTodayIn}"` : "—"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 10, color: "#aaa" }}>Lifts Open</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0c1a2a" }}>
                    {w.liftsOpen !== null ? `${w.liftsOpen} / ${w.liftsTotal ?? "?"}` : "—"}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#aaa" }}>Runs Open</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0c1a2a" }}>
                    {w.runsOpen !== null ? `${w.runsOpen} / ${w.runsTotal ?? "?"}` : "—"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p style={{ fontSize: 12, color: "#aaa" }}>Conditions loading…</p>
          )}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0f0f0", display: "flex", gap: 12 }}>
            <div>
              <p style={{ fontSize: 10, color: "#aaa" }}>Total Runs</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0c1a2a" }}>{resort.trails}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "#aaa" }}>Vertical</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0c1a2a" }}>{resort.vertical}</p>
            </div>
          </div>
          <a
            href={`/resorts/${resort.id}`}
            style={{
              display: "block",
              marginTop: 10,
              padding: "6px 0",
              textAlign: "center",
              background: "#c9a84c",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              color: "#0c1a2a",
              textDecoration: "none",
            }}
          >
            View Resort →
          </a>
        </div>
      </Popup>
    </Marker>
  );
}

export function ResortMap({ resorts }: { resorts: MapResort[] }) {
  const center: LatLngTuple = [40, -100];

  return (
    <MapContainer
      center={center}
      zoom={4}
      minZoom={2}
      style={{ height: "100%", width: "100%", background: "#0c1a2a" }}
      zoomControl={true}
    >
      <FixLeafletIcons />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />
      {resorts.map((resort) => (
        <ResortMarker key={resort.id} resort={resort} />
      ))}
    </MapContainer>
  );
}
