export interface DailyForecast {
  date: string
  weatherCode: number
  condition: string
  snowfallIn: number
  highF: number
  lowF: number
  windMph: number
}

export interface ResortWeather {
  tempF: number
  feelsLikeF: number
  snowDepthFt: number
  snowfallTodayIn: number
  snowfall48hIn: number
  snowfall72hIn: number
  snowfall7dIn: number
  windMph: number
  windGustsMph: number
  weatherCode: number
  condition: string
  forecast: DailyForecast[]
  // Live ski data — null when WWO_API_KEY is not configured
  liftsOpen: number | null
  liftsTotal: number | null
  runsOpen: number | null
  runsTotal: number | null
  snowDepthTopFt: number | null
  snowDepthMidFt: number | null
  overallCondition: string | null
  updatedAt: string
}

export interface Hotel {
  name: string;
  stars: number;
  pricePerNight: number;
  distanceMiles: number;
  amenities: string[];
}

export interface PassCoverage {
  passId: string;
  passName: string;
  access: string;
  blackouts: boolean;
}

export interface Resort {
  id: string;
  name: string;
  location: string;
  state: string;
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
  rating: number;
  priceLevel: number;
  avgTicketPrice: number;
  description: string;
  hotels: Hotel[];
  passes: PassCoverage[];
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
    description: "Jackson Hole Mountain Resort is one of the most iconic ski destinations in North America, rising dramatically from the floor of a glacially carved valley in Wyoming. Famous for its uncompromising terrain — over 50% black and double-black runs — it draws expert skiers seeking genuine challenge from around the world. The 4,139-foot vertical drop, legendary off-piste couloirs, and consistent Rocky Mountain powder make it the definitive bucket-list destination for serious skiers.",
    hotels: [
      { name: "Four Seasons Resort Jackson Hole", stars: 5, pricePerNight: 1200, distanceMiles: 0.1, amenities: ["Ski-in/Ski-out", "Spa", "Heated Pool", "Fine Dining"] },
      { name: "Hotel Terra Jackson Hole", stars: 4, pricePerNight: 450, distanceMiles: 0.3, amenities: ["Rooftop Bar", "Hot Tubs", "Mountain Views", "Shuttle"] },
      { name: "Teton Mountain Lodge & Spa", stars: 4, pricePerNight: 320, distanceMiles: 0.5, amenities: ["Outdoor Pool", "Spa", "Ski Storage", "Fireplace Suites"] },
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "7 days", blackouts: true },
      { passId: "mountain-collective", passName: "Mountain Collective", access: "2 days", blackouts: false },
    ],
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
    description: "Vail is one of the largest ski resorts in North America, anchored by a legendary back-bowl complex spanning over 5,000 acres of open, treeless terrain. The resort blends perfectly groomed front-side runs with vast powder-collecting bowls on the back, creating an experience suited for every skill level. World-class infrastructure, a vibrant European-style village, and year-round amenities have made Vail a flagship destination for decades.",
    hotels: [
      { name: "The Lodge at Vail", stars: 5, pricePerNight: 950, distanceMiles: 0.1, amenities: ["Slope Access", "Spa", "Heated Pool", "Concierge"] },
      { name: "Sonnenalp Vail", stars: 4, pricePerNight: 680, distanceMiles: 0.2, amenities: ["European Spa", "Fine Dining", "Indoor Pool", "Ski Valet"] },
      { name: "Vail Mountain Lodge", stars: 4, pricePerNight: 420, distanceMiles: 0.4, amenities: ["Ski-in/Ski-out", "Hot Tub", "Restaurant", "Locker Room"] },
    ],
    passes: [
      { passId: "epic", passName: "Epic Pass", access: "Unlimited", blackouts: false },
    ],
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
    description: "Tucked into a stunning box canyon in Colorado's San Juan Mountains, Telluride is widely considered the most beautiful ski resort in North America. The vertical mountain face drops directly into a charming Victorian-era mining town, offering some of the steepest inbounds terrain anywhere on the continent. With notoriously low lift lines, impeccable snow quality, and a perfectly preserved historic Main Street, Telluride delivers an experience unlike any other ski resort.",
    hotels: [
      { name: "The Peaks Resort & Spa", stars: 4, pricePerNight: 580, distanceMiles: 0.8, amenities: ["42,000 sq ft Spa", "Indoor Pool", "Mountain Views", "Ski Shuttle"] },
      { name: "Madeline Hotel & Residences", stars: 4, pricePerNight: 520, distanceMiles: 0.5, amenities: ["Rooftop Pool", "Fine Dining", "Ski Concierge", "Fireplace Rooms"] },
      { name: "Hotel Telluride", stars: 3, pricePerNight: 280, distanceMiles: 0.3, amenities: ["Mountain Views", "Bar & Lounge", "Walk to Lifts", "Boutique Style"] },
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "5 days", blackouts: true },
      { passId: "mountain-collective", passName: "Mountain Collective", access: "2 days", blackouts: false },
    ],
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
    description: "Aspen Snowmass is actually four distinct mountains — Snowmass, Aspen Mountain, Aspen Highlands, and Buttermilk — each with its own distinct character and terrain profile. With over 336 trails and 42 lifts spread across thousands of acres, there is genuinely something here for every skier from first-timers at Buttermilk to Olympians testing Aspen Highlands' Highland Bowl. The legendary glamour of Aspen's downtown pairs perfectly with world-class mountain terrain that consistently ranks among the best in the country.",
    hotels: [
      { name: "The Little Nell", stars: 5, pricePerNight: 1800, distanceMiles: 0.1, amenities: ["Ski-in/Ski-out", "Michelin Dining", "Spa", "Butler Service"] },
      { name: "The St. Regis Aspen", stars: 5, pricePerNight: 1500, distanceMiles: 0.2, amenities: ["Butler Service", "Luxury Spa", "Heated Pool", "Ski Concierge"] },
      { name: "Hotel Jerome", stars: 4, pricePerNight: 550, distanceMiles: 0.3, amenities: ["Historic Landmark", "J-Bar", "Mountain Views", "Fitness Center"] },
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "7 days", blackouts: true },
      { passId: "mountain-collective", passName: "Mountain Collective", access: "2 days", blackouts: false },
    ],
  },
  {
    id: "park-city",
    name: "Park City Mountain",
    location: "Park City, UT",
    state: "UT",
    country: "USA",
    region: "Wasatch Range",
    image: "https://plus.unsplash.com/premium_photo-1672115680958-54438df0ab82?w=800&q=80",
    lat: 40.6627, lon: -111.4978,
    trails: 330, totalLifts: 41, vertical: "3,226 ft",
    difficulty: { green: 17, blue: 52, black: 31 },
    terrain: ["Groomers", "Park", "Trees", "Bowls", "Night skiing"],
    rating: 4.5, priceLevel: 3, avgTicketPrice: 169,
    description: "Park City Mountain Resort is the largest ski resort in the United States, formed by the 2015 merger of Park City and Canyons resorts into one massive interconnected mountain. Located just 45 minutes from Salt Lake City International Airport, it offers exceptional accessibility paired with Utah's famous light, dry Wasatch powder. With 330 trails, six terrain parks, and a wide variety of runs across multiple ridgelines, Park City excels for families and intermediate skiers looking for variety without intimidation.",
    hotels: [
      { name: "Waldorf Astoria Park City", stars: 5, pricePerNight: 800, distanceMiles: 0.2, amenities: ["Ski-in/Ski-out", "Spa", "Heated Pool", "Fine Dining"] },
      { name: "Park City Marriott", stars: 4, pricePerNight: 280, distanceMiles: 0.5, amenities: ["Heated Pool", "Fitness Center", "Ski Shuttle", "Restaurant"] },
      { name: "Treasure Mountain Inn", stars: 3, pricePerNight: 160, distanceMiles: 0.4, amenities: ["Walk to Lifts", "Outdoor Hot Tub", "Free Parking", "Historic District"] },
    ],
    passes: [
      { passId: "epic", passName: "Epic Pass", access: "Unlimited", blackouts: false },
    ],
  },
  {
    id: "breckenridge",
    name: "Breckenridge",
    location: "Breckenridge, CO",
    state: "CO",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?w=800&q=80",
    lat: 39.4785, lon: -106.068,
    trails: 187, totalLifts: 35, vertical: "3,398 ft",
    difficulty: { green: 15, blue: 31, black: 54 },
    terrain: ["Imperial Bowl", "Peak 6", "Terrain parks", "Groomers", "Trees"],
    rating: 4.4, priceLevel: 3, avgTicketPrice: 169,
    description: "Breckenridge is one of Colorado's most visited ski resorts, spread across five peaks between 9,600 and 12,998 feet — including the highest lift-served terrain in North America at Imperial Chair. The resort offers an extraordinary range of experiences, from perfectly groomed intermediate runs on Peaks 8 and 9 to the exposed, wind-scoured high-alpine bowls of Peaks 6 and 7. The adjacent Victorian mining town is one of the best ski towns in Colorado, filled with independent restaurants, craft breweries, and excellent nightlife.",
    hotels: [
      { name: "Grand Hyatt Breckenridge", stars: 4, pricePerNight: 480, distanceMiles: 0.2, amenities: ["Ski-in/Ski-out", "Spa", "Rooftop Pool", "Multiple Restaurants"] },
      { name: "Village at Breckenridge", stars: 3, pricePerNight: 240, distanceMiles: 0.1, amenities: ["Slope Access", "Kitchen Units", "Hot Tub", "Ski Storage"] },
      { name: "Beaver Run Resort", stars: 3, pricePerNight: 200, distanceMiles: 0.3, amenities: ["Indoor Pool", "Hot Tubs", "Conference Rooms", "Restaurant"] },
    ],
    passes: [
      { passId: "epic", passName: "Epic Pass", access: "Unlimited", blackouts: false },
    ],
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
    description: "Mammoth Mountain is California's premier ski destination, rising to 11,053 feet above sea level in the stunning Eastern Sierra Nevada range near the Nevada border. The resort receives some of the deepest snowpack in North America, regularly staying open into June or even July thanks to its remarkable elevation and consistent storm cycles. With 300 trails, 25 lifts, and frequent California sunshine, Mammoth offers a uniquely West Coast combination of serious skiing terrain and warm, high-altitude clarity.",
    hotels: [
      { name: "Westin Monache Resort", stars: 4, pricePerNight: 380, distanceMiles: 0.4, amenities: ["Ski-in/Ski-out", "Heated Pool", "Spa", "Village Location"] },
      { name: "Mammoth Mountain Inn", stars: 3, pricePerNight: 220, distanceMiles: 0.1, amenities: ["Gondola Access", "Restaurant", "Ski Storage", "Mountain Views"] },
      { name: "Juniper Springs Resort", stars: 3, pricePerNight: 260, distanceMiles: 0.6, amenities: ["Hot Springs Pool", "Kitchen Units", "Shuttle", "Fitness Center"] },
    ],
    passes: [
      { passId: "epic", passName: "Epic Pass", access: "Unlimited", blackouts: true },
    ],
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
    description: "Steamboat Springs is world-famous for its 'Champagne Powder' — an extraordinarily light, fluffy snow produced by the resort's unique position in Colorado's northern Rockies where cold Arctic air collides with Pacific moisture. With 169 trails spread across Mount Werner, the resort is equally well-suited for families learning to ski as it is for advanced riders seeking gladed tree runs and natural terrain features. The authentic western cowboy town at the base — one of Colorado's oldest ski towns — adds real character and warmth to the experience.",
    hotels: [
      { name: "The Steamboat Grand", stars: 4, pricePerNight: 340, distanceMiles: 0.1, amenities: ["Ski-in/Ski-out", "Heated Pool", "Spa", "Multiple Dining Options"] },
      { name: "Sheraton Steamboat Resort", stars: 4, pricePerNight: 290, distanceMiles: 0.3, amenities: ["Slope Views", "Indoor Pool", "Fitness Center", "Ski Shuttle"] },
      { name: "Ptarmigan Inn", stars: 3, pricePerNight: 180, distanceMiles: 0.5, amenities: ["Mountain Views", "Free Shuttle", "Hot Tub", "Budget-Friendly"] },
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "Unlimited", blackouts: false },
    ],
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
    description: "Big Sky Resort is one of the most underrated ski destinations in North America, offering over 5,800 acres of lift-served terrain with famously sparse crowds — earning it the title 'The Biggest Skiing in America.' Lone Peak at 11,166 feet provides access to some of the most challenging and rewarding inbounds terrain anywhere in the country, including the infamous Big Couloir. With just one person per acre on an average day, Big Sky delivers the rare combination of world-class skiing and genuine wilderness solitude.",
    hotels: [
      { name: "Summit Hotel at Big Sky", stars: 4, pricePerNight: 520, distanceMiles: 0.1, amenities: ["Slopeside Access", "Hot Tubs", "Restaurant", "Ski Concierge"] },
      { name: "Huntley Lodge", stars: 3, pricePerNight: 280, distanceMiles: 0.2, amenities: ["Indoor Pool", "Hot Tubs", "Mountain Village", "Family Suites"] },
      { name: "Mountain Village Center Condos", stars: 3, pricePerNight: 220, distanceMiles: 0.5, amenities: ["Full Kitchen", "Mountain Views", "Free Parking", "Ski Storage"] },
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "Unlimited", blackouts: false },
      { passId: "mountain-collective", passName: "Mountain Collective", access: "2 days", blackouts: false },
    ],
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
    description: "Killington — the 'Beast of the East' — is the largest ski resort in the eastern United States, with six interconnected peaks, 155 trails, and the most vertical drop in the region at 3,050 feet. The resort's world-class snowmaking system covering nearly every trail ensures reliable conditions even in marginal winters, typically opening in October and closing in late spring. Killington has a lively, irreverent culture built around serious skiing that stands proudly apart from the old-money New England ski scene.",
    hotels: [
      { name: "The Grand Killington", stars: 4, pricePerNight: 380, distanceMiles: 0.5, amenities: ["Ski Shuttle", "Spa", "Indoor Pool", "Restaurant"] },
      { name: "Killington Mountain Lodge", stars: 4, pricePerNight: 320, distanceMiles: 0.2, amenities: ["Slope Access", "Bar & Grill", "Hot Tub", "Ski Storage"] },
      { name: "Sunrise Village Condominiums", stars: 3, pricePerNight: 180, distanceMiles: 0.8, amenities: ["Full Kitchen", "Free Shuttle", "Indoor Pool", "Fireplace"] }
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "7 days", blackouts: true }
    ]
  },
  {
    id: "snowbird",
    name: "Snowbird",
    location: "Little Cottonwood Canyon, UT",
    state: "UT",
    country: "USA",
    region: "Wasatch Range",
    image: "https://images.unsplash.com/photo-1548777123-e216912df7d8?w=800&q=80",
    lat: 40.5829, lon: -111.6553,
    trails: 169, totalLifts: 14, vertical: "3,240 ft",
    difficulty: { green: 27, blue: 38, black: 35 },
    terrain: ["Powder bowls", "Steeps", "Glades", "Mineral Basin", "Groomers"],
    rating: 4.7, priceLevel: 3, avgTicketPrice: 199,
    description: "Snowbird sits at the top of Little Cottonwood Canyon, one of the most reliably snowy corridors in Utah, receiving an average of 500 inches of light Wasatch powder each season. The resort's aerial tram whisks 125 riders at a time to the 11,000-foot Hidden Peak, opening access to expansive bowl skiing on both the front and back sides of the mountain. Snowbird's reputation for expert-level terrain is well-earned, but the resort's breadth — from beginner runs to double-black couloirs — makes it one of the most complete ski resorts in the country.",
    hotels: [
      { name: "The Cliff Lodge & Spa", stars: 4, pricePerNight: 420, distanceMiles: 0.1, amenities: ["Ski-in/Ski-out", "Rooftop Pool", "Full Spa", "Multiple Restaurants"] },
      { name: "The Lodge at Snowbird", stars: 3, pricePerNight: 260, distanceMiles: 0.2, amenities: ["Tram Access", "Outdoor Pool", "Mountain Views", "Ski Storage"] },
      { name: "The Inn at Snowbird", stars: 3, pricePerNight: 200, distanceMiles: 0.4, amenities: ["Hot Tub", "Free Shuttle", "Kitchen Suites", "Budget-Friendly"] }
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "7 days", blackouts: true },
      { passId: "mountain-collective", passName: "Mountain Collective", access: "2 days", blackouts: false }
    ]
  },
  {
    id: "alta",
    name: "Alta",
    location: "Alta, UT",
    state: "UT",
    country: "USA",
    region: "Wasatch Range",
    image: "https://plus.unsplash.com/premium_photo-1669990950563-8b31d8ed237b?q=80&w=1675&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lat: 40.5882, lon: -111.6378,
    trails: 119, totalLifts: 11, vertical: "2,538 ft",
    difficulty: { green: 25, blue: 40, black: 35 },
    terrain: ["Powder bowls", "Glades", "Chutes", "Groomers", "Cirques"],
    rating: 4.8, priceLevel: 3, avgTicketPrice: 159,
    description: "Alta is one of only three ski-only resorts remaining in the United States, a distinction that perfectly captures its identity as a pure, unapologetically old-school ski mountain. Sitting adjacent to Snowbird in the same canyon, Alta receives the same legendary Wasatch powder but channels it through a more intimate, unhurried atmosphere built for people who came to ski above everything else. The resort's interconnect with Snowbird via Mineral Basin creates one of the greatest powder ski experiences in North America on a fresh snow day.",
    hotels: [
      { name: "Alta Lodge", stars: 4, pricePerNight: 480, distanceMiles: 0.1, amenities: ["Ski-in/Ski-out", "Classic Lodge Feel", "Family Style Dining", "Hot Tub"] },
      { name: "Rustler Lodge", stars: 4, pricePerNight: 380, distanceMiles: 0.2, amenities: ["Heated Outdoor Pool", "Fine Dining", "Ski Valet", "Mountain Views"] },
      { name: "Goldminer's Daughter Lodge", stars: 3, pricePerNight: 220, distanceMiles: 0.3, amenities: ["Slope Access", "Cozy Rooms", "Restaurant", "Après-Ski Bar"] }
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "7 days", blackouts: true }
    ]
  },
  {
    id: "stowe",
    name: "Stowe",
    location: "Stowe, VT",
    state: "VT",
    country: "USA",
    region: "New England",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
    lat: 44.5309, lon: -72.7814,
    trails: 116, totalLifts: 13, vertical: "2,360 ft",
    difficulty: { green: 16, blue: 59, black: 25 },
    terrain: ["Groomers", "Glades", "Front Four", "Spruce Peak", "Snowmaking"],
    rating: 4.6, priceLevel: 3, avgTicketPrice: 149,
    description: "Stowe is arguably the most iconic ski resort in New England — a quintessential Vermont village at the foot of Mount Mansfield, the state's highest peak. The storied Front Four — National, Liftline, Goat, and Starr — represent some of the most respected steep terrain in the East, while the broader mountain offers exceptional groomed cruisers for all ability levels. Since its acquisition by Vail Resorts, Stowe has received significant capital investment, adding the Spruce Peak village and modern lift infrastructure while preserving the classic New England character that made it famous.",
    hotels: [
      { name: "Stowe Mountain Lodge", stars: 5, pricePerNight: 680, distanceMiles: 0.1, amenities: ["Ski-in/Ski-out", "Full Spa", "Heated Pool", "Farm-to-Table Dining"] },
      { name: "Spruce Peak Hotel", stars: 4, pricePerNight: 420, distanceMiles: 0.2, amenities: ["Village Location", "Gondola Access", "Fitness Center", "Restaurants"] },
      { name: "Trapp Family Lodge", stars: 4, pricePerNight: 300, distanceMiles: 2.0, amenities: ["Nordic Skiing", "Mountain Views", "Austrian-Style", "Cross-Country Trails"] }
    ],
    passes: [
      { passId: "epic", passName: "Epic Pass", access: "Unlimited", blackouts: false }
    ]
  },
  {
    id: "palisades-tahoe",
    name: "Palisades Tahoe",
    location: "Olympic Valley, CA",
    state: "CA",
    country: "USA",
    region: "Sierra Nevada",
    image: "https://plus.unsplash.com/premium_photo-1670598342794-249547599860?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lat: 39.1968, lon: -120.2357,
    trails: 270, totalLifts: 42, vertical: "2,850 ft",
    difficulty: { green: 25, blue: 45, black: 30 },
    terrain: ["KT-22", "Headwall", "Terrain parks", "Alpine Meadows", "Powder bowls"],
    rating: 4.6, priceLevel: 3, avgTicketPrice: 179,
    description: "Palisades Tahoe — the combined resort formerly known as Squaw Valley and Alpine Meadows — is one of the largest ski areas in California, hosting the 1960 Winter Olympics and shaping several generations of freestyle skiing culture. The interconnected mountain spans two distinct base areas linked by a gondola, offering a remarkable variety of terrain from the technical KT-22 chair and its wall-to-wall expert lines to the broad, playful alpine meadows of the adjacent Alpine side. Lake Tahoe's intense winter storms deliver some of the most frequent and deep Sierra snowfall of any resort in the region.",
    hotels: [
      { name: "The Village at Palisades Tahoe", stars: 4, pricePerNight: 480, distanceMiles: 0.1, amenities: ["Slope Access", "Village Restaurants", "Hot Tubs", "Ski Storage"] },
      { name: "PlumpJack Inn", stars: 4, pricePerNight: 380, distanceMiles: 0.2, amenities: ["Boutique Style", "Fireplaces", "Fine Dining", "Mountain Views"] },
      { name: "Resort at Squaw Creek", stars: 4, pricePerNight: 340, distanceMiles: 0.5, amenities: ["Ski-in/Ski-out", "Golf Course", "Spa", "Multiple Pools"] }
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "Unlimited", blackouts: false }
    ]
  },
  {
    id: "sun-valley",
    name: "Sun Valley",
    location: "Sun Valley, ID",
    state: "ID",
    country: "USA",
    region: "Northern Rockies",
    image: "https://plus.unsplash.com/premium_photo-1670493556860-13e006e6faa4?q=80&w=1297&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lat: 43.6962, lon: -114.3503,
    trails: 121, totalLifts: 19, vertical: "3,400 ft",
    difficulty: { green: 36, blue: 42, black: 22 },
    terrain: ["Bald Mountain", "Seattle Ridge", "Groomers", "Glades", "Exhibition"],
    rating: 4.6, priceLevel: 4, avgTicketPrice: 209,
    description: "Sun Valley holds the distinction of being America's first destination ski resort, opening in 1936 and inventing the concept of the purpose-built ski lodge. Bald Mountain — universally called 'Baldy' — rises 9,150 feet with a consistent pitch and impeccably groomed runs that make it a favorite among expert skiers who prize technique and speed. The resort's relatively low snowfall is offset by exceptional snowmaking and a culture of precision grooming that keeps Baldy in perfect condition throughout the season. The surrounding town of Ketchum is one of the great ski towns in America.",
    hotels: [
      { name: "Sun Valley Lodge", stars: 5, pricePerNight: 750, distanceMiles: 0.5, amenities: ["Historic Landmark", "Outdoor Ice Rink", "Full Spa", "Multiple Pools"] },
      { name: "Sun Valley Inn", stars: 4, pricePerNight: 360, distanceMiles: 0.5, amenities: ["Shuttle to Slopes", "Indoor Pool", "Tennis", "Family-Friendly"] },
      { name: "Knob Hill Inn", stars: 4, pricePerNight: 320, distanceMiles: 1.0, amenities: ["Boutique Hotel", "Heated Pool", "European Style", "Concierge"] }
    ],
    passes: [
      { passId: "mountain-collective", passName: "Mountain Collective", access: "2 days", blackouts: false }
    ]
  },
  {
    id: "taos",
    name: "Taos Ski Valley",
    location: "Taos, NM",
    state: "NM",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    lat: 36.595, lon: -105.4536,
    trails: 110, totalLifts: 15, vertical: "2,612 ft",
    difficulty: { green: 24, blue: 25, black: 51 },
    terrain: ["Hike-to terrain", "Steeps", "Glades", "Chutes", "Moguls"],
    rating: 4.7, priceLevel: 3, avgTicketPrice: 169,
    description: "Taos Ski Valley is the most underrated expert ski resort in America — a cult destination tucked into the Sangre de Cristo Mountains of northern New Mexico that rewards those willing to make the journey. Over half its terrain is classified black or double-black, with legendary steep shots like Stauffenberg, Al's Run, and Reforma dropping directly from the ridge in full view of the base lodge. The resort's intimate scale, minimal crowds, and remarkably dry, high-altitude snow create an experience that regulars describe as the closest thing to a hidden gem left in American skiing.",
    hotels: [
      { name: "The Blake at Taos Ski Valley", stars: 4, pricePerNight: 380, distanceMiles: 0.1, amenities: ["Ski-in/Ski-out", "Full Spa", "Heated Pool", "Farm-to-Table Restaurant"] },
      { name: "Edelweiss Lodge & Spa", stars: 4, pricePerNight: 300, distanceMiles: 0.2, amenities: ["European Alpine Style", "Hot Tubs", "Spa Services", "Mountain Views"] },
      { name: "Austing Haus Hotel", stars: 3, pricePerNight: 190, distanceMiles: 1.5, amenities: ["Classic Lodge", "Hot Tub", "Shuttle", "Family Suites"] }
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "7 days", blackouts: true },
      { passId: "mountain-collective", passName: "Mountain Collective", access: "2 days", blackouts: false }
    ]
  },
  {
    id: "crested-butte",
    name: "Crested Butte",
    location: "Mt. Crested Butte, CO",
    state: "CO",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1604537466573-5e94508fd243?w=800&q=80",
    lat: 38.8978, lon: -106.9625,
    trails: 131, totalLifts: 16, vertical: "2,775 ft",
    difficulty: { green: 13, blue: 29, black: 58 },
    terrain: ["Extreme terrain", "Steeps", "Glades", "Snowcat skiing", "Moguls"],
    rating: 4.6, priceLevel: 3, avgTicketPrice: 149,
    description: "Crested Butte is Colorado's mountain for skiers who have outgrown everywhere else. The resort's extreme terrain zone — accessed via the North Face — is the most concentrated collection of legitimate double-black expert runs in Colorado, featuring pitches that regularly exceed 50 degrees. Beyond the expert terrain, the rest of the mountain is a well-rounded mix of groomers and gladed runs served by a modern lift network. The nearby Victorian mining town of Crested Butte, largely unchanged for decades, is one of the most authentic and charming ski towns in the American West.",
    hotels: [
      { name: "Elevation Hotel & Spa", stars: 4, pricePerNight: 420, distanceMiles: 0.1, amenities: ["Ski-in/Ski-out", "Full Spa", "Rooftop Hot Tubs", "Mountain Restaurant"] },
      { name: "Grand Lodge Crested Butte", stars: 3, pricePerNight: 260, distanceMiles: 0.3, amenities: ["Indoor Pool", "Hot Tubs", "Fitness Center", "Ski Storage"] },
      { name: "Cristiana Guesthaus", stars: 3, pricePerNight: 180, distanceMiles: 1.0, amenities: ["Historic B&B", "Hot Tub", "Breakfast Included", "Town Location"] }
    ],
    passes: [
      { passId: "ikon", passName: "Ikon Pass", access: "7 days", blackouts: true }
    ]
  },
  {
    id: "keystone",
    name: "Keystone",
    location: "Keystone, CO",
    state: "CO",
    country: "USA",
    region: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1545586860-95d2040c1680?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lat: 39.6058, lon: -105.9378,
    trails: 135, totalLifts: 20, vertical: "3,128 ft",
    difficulty: { green: 12, blue: 33, black: 55 },
    terrain: ["Night skiing", "Terrain parks", "Bowls", "Groomers", "Trees"],
    rating: 4.2, priceLevel: 2, avgTicketPrice: 109,
    description: "Keystone is one of Colorado's most family-friendly and accessible ski resorts, offering the state's most extensive night skiing operation across North Peak and the River Run area. Three distinct mountain faces — Keystone Mountain, North Peak, and Outback — provide a natural progression from wide groomed beginner terrain to challenging bowl skiing, all connected by a well-designed lift network. Its proximity to Denver along I-70, inclusion on the Epic Pass, and comparatively reasonable ticket prices make Keystone one of the most popular entry points into Summit County skiing.",
    hotels: [
      { name: "Keystone Lodge & Spa", stars: 4, pricePerNight: 340, distanceMiles: 0.3, amenities: ["Lakeside Setting", "Spa", "Heated Pool", "Multiple Restaurants"] },
      { name: "River Run Condominiums", stars: 3, pricePerNight: 240, distanceMiles: 0.1, amenities: ["Gondola Access", "Full Kitchen", "Hot Tub", "Village Location"] },
      { name: "Ski Tip Lodge", stars: 3, pricePerNight: 200, distanceMiles: 1.0, amenities: ["Historic B&B", "Gourmet Breakfast", "Fireplaces", "Nordic Trails"] }
    ],
    passes: [
      { passId: "epic", passName: "Epic Pass", access: "Unlimited", blackouts: false }
    ]
  }
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
): { openRuns: number; isOpen: boolean; isEstimate: boolean } {
  if (!weather) return { openRuns: 0, isOpen: false, isEstimate: false }
  if (weather.runsOpen !== null) {
    return { openRuns: weather.runsOpen, isOpen: weather.runsOpen > 0, isEstimate: false }
  }
  // Fall back to snow-depth estimate when live data unavailable
  const d = weather.snowDepthFt
  let pct = 0
  if (d > 3) pct = 0.95
  else if (d > 2) pct = 0.85
  else if (d > 1) pct = 0.65
  else if (d > 0.3) pct = 0.35
  else if (d > 0) pct = 0.15
  return { openRuns: Math.round(totalTrails * pct), isOpen: pct > 0, isEstimate: true }
}

const PAST_DAYS = 3

interface WwoSkiData {
  liftsOpen: number | null
  liftsTotal: number | null
  runsOpen: number | null
  runsTotal: number | null
  snowDepthTopFt: number | null
  snowDepthMidFt: number | null
  overallCondition: string | null
}

async function fetchWWOSkiData(lat: number, lon: number): Promise<WwoSkiData | null> {
  const key = process.env.WWO_API_KEY
  if (!key) return null
  try {
    const url =
      `https://api.worldweatheronline.com/premium/v1/ski.ashx` +
      `?key=${key}&q=${lat},${lon}&format=json&num_of_days=1`
    const res = await fetch(url, { next: { revalidate: 1800 } })
    if (!res.ok) return null
    const data = await res.json()
    const w = data?.data?.weather?.[0]
    if (!w) return null
    const num = (v: unknown): number | null => {
      const n = parseFloat(String(v ?? ''))
      return isNaN(n) ? null : n
    }
    const cmToFt = (cm: number | null): number | null =>
      cm !== null ? Math.round(cm * 0.0328084 * 10) / 10 : null
    return {
      liftsOpen: num(w.lifts_open),
      liftsTotal: num(w.lifts_total),
      runsOpen: num(w.runs_open),
      runsTotal: num(w.runs_total),
      snowDepthTopFt: cmToFt(num(w.top_snowDepth_cm)),
      snowDepthMidFt: cmToFt(num(w.mid_snowDepth_cm)),
      overallCondition: typeof w.Overall_condition === 'string' && w.Overall_condition ? w.Overall_condition : null
    }
  } catch {
    return null
  }
}

export async function fetchResortWeather(
  lat: number,
  lon: number
): Promise<ResortWeather | null> {
  try {
    const openMeteoUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,snowfall,snow_depth,weather_code,wind_speed_10m,wind_gusts_10m` +
      `&daily=snowfall_sum,snow_depth_max,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,weather_code` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch` +
      `&timezone=auto&forecast_days=8&past_days=${PAST_DAYS}`

    const [res, skiData] = await Promise.all([
      fetch(openMeteoUrl, { next: { revalidate: 900 } }),
      fetchWWOSkiData(lat, lon)
    ])
    if (!res.ok) return null
    const data = await res.json()
    const c = data.current
    const d = data.daily
    const ti = PAST_DAYS

    const s = (i: number) => d.snowfall_sum?.[i] ?? 0
    const snowfall48h = Math.round((s(ti) + s(ti - 1)) * 10) / 10
    const snowfall72h = Math.round((s(ti) + s(ti - 1) + s(ti - 2)) * 10) / 10
    const snowfall7d = Math.round(
      (d.snowfall_sum?.slice(ti + 1) ?? []).reduce((a: number, b: number) => a + b, 0) * 10
    ) / 10

    const forecast: DailyForecast[] = Array.from({ length: 7 }, (_, i) => {
      const idx = ti + 1 + i
      const code = d.weather_code?.[idx] ?? 0
      return {
        date: d.time?.[idx] ?? '',
        weatherCode: code,
        condition: WMO[code] ?? 'Clear Sky',
        snowfallIn: Math.round((d.snowfall_sum?.[idx] ?? 0) * 10) / 10,
        highF: Math.round(d.temperature_2m_max?.[idx] ?? 0),
        lowF: Math.round(d.temperature_2m_min?.[idx] ?? 0),
        windMph: Math.round(d.wind_speed_10m_max?.[idx] ?? 0)
      }
    })

    return {
      tempF: Math.round(c.temperature_2m),
      feelsLikeF: Math.round(c.apparent_temperature),
      snowDepthFt: Math.round(c.snow_depth * 10) / 10,
      snowfallTodayIn: Math.round(s(ti) * 10) / 10,
      snowfall48hIn: snowfall48h,
      snowfall72hIn: snowfall72h,
      snowfall7dIn: snowfall7d,
      windMph: Math.round(c.wind_speed_10m),
      windGustsMph: Math.round(c.wind_gusts_10m),
      weatherCode: c.weather_code,
      condition: wmoToCondition(c.weather_code, c.snow_depth),
      forecast,
      liftsOpen: skiData?.liftsOpen ?? null,
      liftsTotal: skiData?.liftsTotal ?? null,
      runsOpen: skiData?.runsOpen ?? null,
      runsTotal: skiData?.runsTotal ?? null,
      snowDepthTopFt: skiData?.snowDepthTopFt ?? null,
      snowDepthMidFt: skiData?.snowDepthMidFt ?? null,
      overallCondition: skiData?.overallCondition ?? null,
      updatedAt: c.time
    }
  } catch {
    return null
  }
}

export async function fetchAllResortWeather(): Promise<
  (Resort & { weather: ResortWeather | null })[]
> {
  return Promise.all(
    RESORTS.map(async (r) => ({ ...r, weather: await fetchResortWeather(r.lat, r.lon) }))
  );
}
