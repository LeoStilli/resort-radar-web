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
  country: string;
  region: string;
  image: string;
  lat: number;
  lon: number;
  trails: number;
  vertical: string;
  difficulty: { green: number; blue: number; black: number };
  terrain: string[];
  weather?: ResortWeather;
}

export const RESORTS: Resort[] = [
  {
    id: "whistler",
    name: "Whistler Blackcomb",
    location: "British Columbia, Canada",
    country: "Canada",
    region: "Pacific Northwest",
    image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
    lat: 50.0578,
    lon: -122.9454,
    trails: 200,
    vertical: "5,280 ft",
    difficulty: { green: 18, blue: 55, black: 27 },
    terrain: ["Groomed runs", "Moguls", "Glades", "Bowls", "Park"],
  },
  {
    id: "jackson-hole",
    name: "Jackson Hole",
    location: "Wyoming, USA",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80",
    lat: 43.5837,
    lon: -110.8241,
    trails: 133,
    vertical: "4,139 ft",
    difficulty: { green: 10, blue: 40, black: 50 },
    terrain: ["Steeps", "Couloirs", "Powder bowls", "Glades", "Groomers"],
  },
  {
    id: "chamonix",
    name: "Chamonix Mont-Blanc",
    location: "Haute-Savoie, France",
    country: "France",
    region: "Alps",
    image: "https://images.unsplash.com/photo-1520443240718-fce21901db79?w=800&q=80",
    lat: 45.8792,
    lon: 6.8872,
    trails: 170,
    vertical: "9,209 ft",
    difficulty: { green: 18, blue: 41, black: 41 },
    terrain: ["Off-piste", "Glaciers", "Couloirs", "Groomers", "Freeride"],
  },
  {
    id: "niseko",
    name: "Niseko United",
    location: "Hokkaido, Japan",
    country: "Japan",
    region: "Asia Pacific",
    image: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80",
    lat: 42.818,
    lon: 140.7052,
    trails: 87,
    vertical: "3,228 ft",
    difficulty: { green: 30, blue: 40, black: 30 },
    terrain: ["Deep powder", "Tree runs", "Groomed runs", "Night skiing"],
  },
  {
    id: "vail",
    name: "Vail",
    location: "Colorado, USA",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800&q=80",
    lat: 39.6404,
    lon: -106.3742,
    trails: 195,
    vertical: "3,450 ft",
    difficulty: { green: 18, blue: 29, black: 53 },
    terrain: ["Back Bowls", "Blue Sky Basin", "Groomers", "Trees"],
  },
  {
    id: "park-city",
    name: "Park City Mountain",
    location: "Utah, USA",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&q=80",
    lat: 40.6627,
    lon: -111.4978,
    trails: 330,
    vertical: "3,226 ft",
    difficulty: { green: 17, blue: 52, black: 31 },
    terrain: ["Groomers", "Park", "Trees", "Bowls", "Night skiing"],
  },
  {
    id: "telluride",
    name: "Telluride",
    location: "Colorado, USA",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1502126324834-38f8e02d7160?w=800&q=80",
    lat: 37.9354,
    lon: -107.8472,
    trails: 148,
    vertical: "4,425 ft",
    difficulty: { green: 23, blue: 36, black: 41 },
    terrain: ["Steeps", "Glades", "Groomed runs", "Village skiing"],
  },
  {
    id: "zermatt",
    name: "Zermatt",
    location: "Valais, Switzerland",
    country: "Switzerland",
    region: "Alps",
    image: "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=800&q=80",
    lat: 45.9837,
    lon: 7.7483,
    trails: 360,
    vertical: "7,546 ft",
    difficulty: { green: 22, blue: 51, black: 27 },
    terrain: ["Glacier skiing", "Off-piste", "Long groomed runs", "Freeride"],
  },
];

const WMO_CONDITIONS: Record<number, string> = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Icy Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Rain Showers",
  85: "Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
};

function wmoToCondition(code: number, snowDepth: number): string {
  if (code >= 71 && code <= 77) return "Snowing — Powder";
  if (code === 85 || code === 86) return "Snow Showers";
  if (snowDepth > 2) return "Powder";
  if (snowDepth > 0.5) return "Packed Powder";
  if (snowDepth > 0) return "Groomed";
  return WMO_CONDITIONS[code] ?? "Closed";
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

    const res = await fetch(url, {
      next: { revalidate: 900 }, // cache 15 min
    });
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
  const results = await Promise.all(
    RESORTS.map(async (resort) => ({
      ...resort,
      weather: await fetchResortWeather(resort.lat, resort.lon),
    }))
  );
  return results;
}
