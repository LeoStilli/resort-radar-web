export interface ResortWeather {
  tempF: number;
  snowDepthFt: number;
  snowfallTodayIn: number;
  windMph: number;
  weatherCode: number;
  condition: string;
  updatedAt: string;
}

export interface Resort {
  id: string;
  name: string;
  location: string;
  state: string; // US state abbreviation
  country: string;
  region: string;
  image: string;
  lat: number;
  lon: number;
  trails: number;
  totalLifts: number;
  vertical: string;
  difficulty: { green: number; blue: number; black: number };
  terrain: string[];
  rating: number;       // out of 5.0
  priceLevel: number;   // 1–4 ($ to $$$$)
  avgTicketPrice: number; // USD
  weather?: ResortWeather | null;
}

export const RESORTS: Resort[] = [
  {
    id: "jackson-hole",
    name: "Jackson Hole",
    location: "Teton Village, WY",
    state: "WY",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80",
    lat: 43.5837, lon: -110.8241,
    trails: 133, totalLifts: 13, vertical: "4,139 ft",
    difficulty: { green: 10, blue: 40, black: 50 },
    terrain: ["Steeps", "Couloirs", "Powder bowls", "Glades", "Groomers"],
    rating: 4.8, priceLevel: 4, avgTicketPrice: 249,
  },
  {
    id: "vail",
    name: "Vail",
    location: "Vail, CO",
    state: "CO",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800&q=80",
    lat: 39.6404, lon: -106.3742,
    trails: 195, totalLifts: 31, vertical: "3,450 ft",
    difficulty: { green: 18, blue: 29, black: 53 },
    terrain: ["Back Bowls", "Blue Sky Basin", "Groomers", "Trees"],
    rating: 4.7, priceLevel: 4, avgTicketPrice: 259,
  },
  {
    id: "telluride",
    name: "Telluride",
    location: "Telluride, CO",
    state: "CO",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1502126324834-38f8e02d7160?w=800&q=80",
    lat: 37.9354, lon: -107.8472,
    trails: 148, totalLifts: 19, vertical: "4,425 ft",
    difficulty: { green: 23, blue: 36, black: 41 },
    terrain: ["Steeps", "Glades", "Groomed runs", "Village skiing"],
    rating: 4.9, priceLevel: 4, avgTicketPrice: 209,
  },
  {
    id: "aspen",
    name: "Aspen Snowmass",
    location: "Aspen, CO",
    state: "CO",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
    lat: 39.1911, lon: -106.8175,
    trails: 336, totalLifts: 42, vertical: "4,406 ft",
    difficulty: { green: 14, blue: 41, black: 45 },
    terrain: ["Steeps", "Glades", "Long groomers", "Terrain parks", "Bowls"],
    rating: 4.8, priceLevel: 4, avgTicketPrice: 239,
  },
  {
    id: "park-city",
    name: "Park City Mountain",
    location: "Park City, UT",
    state: "UT",
    country: "USA",
    region: "Wasatch Range",
    image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&q=80",
    lat: 40.6627, lon: -111.4978,
    trails: 330, totalLifts: 41, vertical: "3,226 ft",
    difficulty: { green: 17, blue: 52, black: 31 },
    terrain: ["Groomers", "Park", "Trees", "Bowls", "Night skiing"],
    rating: 4.5, priceLevel: 3, avgTicketPrice: 169,
  },
  {
    id: "breckenridge",
    name: "Breckenridge",
    location: "Breckenridge, CO",
    state: "CO",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1520443240718-fce21901db79?w=800&q=80",
    lat: 39.4785, lon: -106.068,
    trails: 187, totalLifts: 35, vertical: "3,398 ft",
    difficulty: { green: 15, blue: 31, black: 54 },
    terrain: ["Imperial Bowl", "Peak 6", "Terrain parks", "Groomers", "Trees"],
    rating: 4.4, priceLevel: 3, avgTicketPrice: 169,
  },
  {
    id: "mammoth",
    name: "Mammoth Mountain",
    location: "Mammoth Lakes, CA",
    state: "CA",
    country: "USA",
    region: "Sierra Nevada",
    image: "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=800&q=80",
    lat: 37.6479, lon: -119.0321,
    trails: 300, totalLifts: 25, vertical: "3,100 ft",
    difficulty: { green: 25, blue: 40, black: 35 },
    terrain: ["Long runs", "Powder bowls", "Terrain parks", "Spring skiing"],
    rating: 4.6, priceLevel: 3, avgTicketPrice: 179,
  },
  {
    id: "steamboat",
    name: "Steamboat Springs",
    location: "Steamboat Springs, CO",
    state: "CO",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    lat: 40.4572, lon: -106.8045,
    trails: 169, totalLifts: 18, vertical: "3,668 ft",
    difficulty: { green: 14, blue: 42, black: 44 },
    terrain: ["Champagne Powder", "Glades", "Groomers", "Terrain parks"],
    rating: 4.4, priceLevel: 3, avgTicketPrice: 149,
  },
  {
    id: "big-sky",
    name: "Big Sky",
    location: "Big Sky, MT",
    state: "MT",
    country: "USA",
    region: "Northern Rockies",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    lat: 45.287, lon: -111.4015,
    trails: 330, totalLifts: 36, vertical: "4,350 ft",
    difficulty: { green: 15, blue: 25, black: 60 },
    terrain: ["Big couloirs", "Lone Peak", "Groomers", "Trees", "Bowls"],
    rating: 4.7, priceLevel: 3, avgTicketPrice: 169,
  },
  {
    id: "killington",
    name: "Killington",
    location: "Killington, VT",
    state: "VT",
    country: "USA",
    region: "New England",
    image: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80",
    lat: 43.6045, lon: -72.8201,
    trails: 155, totalLifts: 22, vertical: "3,050 ft",
    difficulty: { green: 28, blue: 33, black: 39 },
    terrain: ["Groomers", "Moguls", "Glades", "Terrain parks", "Snowmaking"],
    rating: 4.3, priceLevel: 2, avgTicketPrice: 139,
  },
];

const WMO: Record<number, string> = {
  0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Fog", 48: "Icy Fog", 51: "Light Drizzle", 53: "Drizzle",
  61: "Light Rain", 63: "Rain", 65: "Heavy Rain",
  71: "Light Snow", 73: "Snow", 75: "Heavy Snow", 77: "Snow Grains",
  80: "Rain Showers", 85: "Snow Showers", 86: "Heavy Snow Showers",
  95: "Thunderstorm",
};

function wmoToCondition(code: number, snowDepth: number): string {
  if (code >= 71 && code <= 77) return "Snowing — Powder";
  if (code === 85 || code === 86) return "Snow Showers";
  if (snowDepth > 2) return "Powder";
  if (snowDepth > 0.5) return "Packed Powder";
  if (snowDepth > 0) return "Groomed";
  return WMO[code] ?? "Check Resort";
}

export function getOpenStats(
  totalTrails: number,
  weather: ResortWeather | null
): { openRuns: number; isOpen: boolean } {
  if (!weather) return { openRuns: 0, isOpen: false };
  const d = weather.snowDepthFt;
  let pct = 0;
  if (d > 3) pct = 0.95;
  else if (d > 2) pct = 0.85;
  else if (d > 1) pct = 0.65;
  else if (d > 0.3) pct = 0.35;
  else if (d > 0) pct = 0.15;
  const openRuns = Math.round(totalTrails * pct);
  return { openRuns, isOpen: openRuns > 0 };
}

export async function fetchResortWeather(
  lat: number,
  lon: number
): Promise<ResortWeather | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,snowfall,snow_depth,weather_code,wind_speed_10m` +
      `&daily=snowfall_sum,snow_depth_max` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch` +
      `&timezone=auto&forecast_days=1`;
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) return null;
    const data = await res.json();
    const c = data.current;
    const d = data.daily;
    return {
      tempF: Math.round(c.temperature_2m),
      snowDepthFt: Math.round(c.snow_depth * 10) / 10,
      snowfallTodayIn: Math.round((d.snowfall_sum?.[0] ?? 0) * 10) / 10,
      windMph: Math.round(c.wind_speed_10m),
      weatherCode: c.weather_code,
      condition: wmoToCondition(c.weather_code, c.snow_depth),
      updatedAt: c.time,
    };
  } catch {
    return null;
  }
}

export async function fetchAllResortWeather(): Promise<
  (Resort & { weather: ResortWeather | null })[]
> {
  return Promise.all(
    RESORTS.map(async (r) => ({ ...r, weather: await fetchResortWeather(r.lat, r.lon) }))
  );
}
