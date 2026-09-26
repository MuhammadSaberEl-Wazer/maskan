export type ProductTier = "Essential" | "Comfort" | "Plus";
export type UnitGender = "Men" | "Women";
export type RoomKind = "Private room" | "Shared room";
export type StructureType = "Original room" | "Partitioned room";

export type Space = {
  id: string;
  roomCode: string;
  bedCode: string;
  kind: RoomKind;
  structure: StructureType;
  capacity: number;
  availableBeds: number;
  monthlyPrice: number;
  ensuite: boolean;
};

export type Property = {
  id: string;
  slug: string;
  code: string;
  name: string;
  area: string;
  neighborhood: string;
  type: ProductTier;
  gender: UnitGender;
  price: number;
  available: number;
  totalBeds: number;
  occupiedBeds: number;
  image: string;
  gallery: string[];
  description: string;
  commute: string;
  amenities: string[];
  spaces: Space[];
};

export type DurationMonths = 1 | 3 | 6 | 12;

export const durationOptions: Array<{
  months: DurationMonths;
  label: string;
  discount: number;
}> = [
  { months: 1, label: "1 month", discount: 0 },
  { months: 3, label: "3 months", discount: 0.04 },
  { months: 6, label: "6 months", discount: 0.07 },
  { months: 12, label: "12 months", discount: 0.1 },
];

export function getBookingQuote(basePrice: number, duration: DurationMonths) {
  const rule = durationOptions.find((option) => option.months === duration)!;
  const monthlyPrice = Math.round((basePrice * (1 - rule.discount)) / 50) * 50;
  const depositAmount = monthlyPrice;

  return {
    monthlyPrice,
    depositAmount,
    rentTotal: monthlyPrice * duration,
    discount: rule.discount,
  };
}

type PropertySeed = Omit<Property, "id" | "spaces" | "gallery"> & {
  gallery?: string[];
  partitioned?: boolean;
};

const image = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=86`;

const sharedGallery = [
  image("1600607687920-4e2a09cf159d"),
  image("1600566753190-17f0baa2a6c3"),
  image("1554995207-c18c203602cb"),
];

function createSpaces(seed: PropertySeed): Space[] {
  const code = seed.code.toLowerCase();
  const privatePrice =
    seed.price + (seed.type === "Plus" ? 2200 : seed.type === "Comfort" ? 1500 : 900);
  const sharedCapacity = seed.type === "Plus" ? 2 : seed.type === "Comfort" ? 2 : 3;

  return [
    {
      id: `bed-${code}-a1`,
      roomCode: "Room A",
      bedCode: "A1",
      kind: "Private room",
      structure: "Original room",
      capacity: 1,
      availableBeds: seed.available > 0 ? 1 : 0,
      monthlyPrice: privatePrice,
      ensuite: seed.type === "Plus",
    },
    {
      id: `bed-${code}-b1`,
      roomCode: "Room B",
      bedCode: "B1",
      kind: "Shared room",
      structure: seed.partitioned ? "Partitioned room" : "Original room",
      capacity: sharedCapacity,
      availableBeds: Math.max(0, Math.min(seed.available - 1, sharedCapacity)),
      monthlyPrice: seed.price,
      ensuite: false,
    },
  ];
}

const seeds: PropertySeed[] = [
  { slug: "ninety-residence", code: "MSK-NC-001", name: "Ninety Residence", area: "New Cairo", neighborhood: "South 90th", type: "Plus", gender: "Women", price: 7500, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1600210492486-724fe5c67fb0"), description: "Private-first managed living close to New Cairo's business and university districts.", commute: "8 min to South 90th offices", amenities: ["High-speed Wi-Fi", "Weekly cleaning", "Air conditioning", "Equipped kitchen", "Resident support", "Smart access"] },
  { slug: "fifth-settlement-house", code: "MSK-NC-002", name: "Fifth Settlement House", area: "New Cairo", neighborhood: "Fifth Settlement", type: "Comfort", gender: "Men", price: 5900, available: 2, totalBeds: 7, occupiedBeds: 5, image: image("1600566753086-00f18fb6b3ea"), description: "A calm, practical home for professionals with generous shared spaces.", commute: "12 min to AUC", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Equipped kitchen", "Maintenance", "Balcony"] },
  { slug: "lotus-corner", code: "MSK-NC-003", name: "Lotus Corner", area: "New Cairo", neighborhood: "Lotus", type: "Comfort", gender: "Women", price: 5600, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1600607687939-ce8a6c25118c"), description: "Bright furnished rooms with a balanced shared-home layout and managed services.", commute: "10 min to North 90th", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Equipped kitchen", "Maintenance", "Workspace"] },
  { slug: "rehab-gate", code: "MSK-NC-004", name: "Rehab Gate", area: "New Cairo", neighborhood: "Al Rehab", type: "Plus", gender: "Men", price: 8200, available: 2, totalBeds: 7, occupiedBeds: 5, image: image("1600573472550-8090b5e0745e"), description: "Premium, private-heavy living with quiet interiors and reliable day-to-day support.", commute: "6 min to Gate 13", amenities: ["High-speed Wi-Fi", "Weekly cleaning", "Air conditioning", "Premium furnishing", "Resident support", "Elevator"] },
  { slug: "nasr-city-park", code: "MSK-NS-001", name: "Nasr City Park", area: "Nasr City", neighborhood: "7th District", type: "Comfort", gender: "Men", price: 4500, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1502672260266-1c1ef2d93688"), description: "Comfortable managed living for students and young professionals near daily essentials.", commute: "7 min to Abbas El Akkad", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Maintenance", "Equipped kitchen", "Elevator"] },
  { slug: "makram-residence", code: "MSK-NS-002", name: "Makram Residence", area: "Nasr City", neighborhood: "Makram Ebeid", type: "Comfort", gender: "Women", price: 4800, available: 1, totalBeds: 8, occupiedBeds: 7, image: image("1493809842364-78817add7ffb"), description: "An organized women-only home with strong transport access and comfortable common areas.", commute: "4 min to Makram Ebeid", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Maintenance", "Equipped kitchen", "Doorman"] },
  { slug: "rabaah-house", code: "MSK-NS-003", name: "Rabaah House", area: "Nasr City", neighborhood: "6th District", type: "Essential", gender: "Men", price: 3300, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1560448204-e02f11c3d0e2"), description: "Affordable shared housing designed around durable furnishing and predictable monthly costs.", commute: "9 min to Rabaa Square", amenities: ["Wi-Fi", "Scheduled cleaning", "Maintenance", "Equipped kitchen", "Study desks"], partitioned: true },
  { slug: "zahraa-court", code: "MSK-NS-004", name: "Zahraa Court", area: "Nasr City", neighborhood: "Zahraa Nasr City", type: "Essential", gender: "Women", price: 3100, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1522708323590-d24dbb6b0267"), description: "A well-run shared home with practical rooms and reliable resident support.", commute: "11 min to City Stars", amenities: ["Wi-Fi", "Scheduled cleaning", "Maintenance", "Equipped kitchen", "House rules"], partitioned: true },
  { slug: "smouha-court", code: "MSK-ALX-001", name: "Smouha Court", area: "Alexandria", neighborhood: "Smouha", type: "Comfort", gender: "Women", price: 5500, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1560185008-b033106af5c3"), description: "Calm managed living in central Alexandria with reliable everyday services.", commute: "7 min to Smouha Club", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Maintenance", "Laundry", "Balcony"] },
  { slug: "kafr-abdo-home", code: "MSK-ALX-002", name: "Kafr Abdo Home", area: "Alexandria", neighborhood: "Kafr Abdo", type: "Plus", gender: "Men", price: 7900, available: 1, totalBeds: 6, occupiedBeds: 5, image: image("1600566753051-f0b89df2dd90"), description: "A premium Alexandria home with private rooms, refined furnishing, and responsive support.", commute: "6 min to Kafr Abdo Square", amenities: ["High-speed Wi-Fi", "Weekly cleaning", "Air conditioning", "Premium furnishing", "Resident support", "Elevator"] },
  { slug: "sidi-gaber-house", code: "MSK-ALX-003", name: "Sidi Gaber House", area: "Alexandria", neighborhood: "Sidi Gaber", type: "Comfort", gender: "Women", price: 5000, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1615874694520-474822394e73"), description: "A welcoming, well-connected home with practical rooms and a clear service standard.", commute: "8 min to Sidi Gaber Station", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Maintenance", "Equipped kitchen"] },
  { slug: "mansoura-garden", code: "MSK-MNS-001", name: "Mansoura Garden", area: "Mansoura", neighborhood: "El Mashaya", type: "Essential", gender: "Women", price: 3500, available: 1, totalBeds: 8, occupiedBeds: 7, image: image("1554995207-c18c203602cb"), description: "Bright, practical shared living near Mansoura University with dependable managed services.", commute: "10 min to Mansoura University", amenities: ["Wi-Fi", "Scheduled cleaning", "Maintenance", "Equipped kitchen", "Study desks", "Garden view"], partitioned: true },
  { slug: "mansoura-university-residence", code: "MSK-MNS-002", name: "Mansoura University Residence", area: "Mansoura", neighborhood: "University District", type: "Comfort", gender: "Men", price: 4200, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1564013799919-ab600027ffc6"), description: "Student-friendly managed accommodation with focused study spaces and clear house rules.", commute: "6 min to Mansoura University", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Maintenance", "Study desks", "Equipped kitchen"] },
  { slug: "mansoura-central", code: "MSK-MNS-003", name: "Mansoura Central", area: "Mansoura", neighborhood: "El Gomhoria", type: "Essential", gender: "Women", price: 3200, available: 2, totalBeds: 8, occupiedBeds: 6, image: image("1586023492125-27b2c045efd7"), description: "Affordable, organized housing close to transport and daily shopping.", commute: "5 min to El Gomhoria Street", amenities: ["Wi-Fi", "Scheduled cleaning", "Maintenance", "Equipped kitchen", "House rules"], partitioned: true },
  { slug: "assiut-nile", code: "MSK-AST-001", name: "Assiut Nile", area: "Assiut", neighborhood: "El Gomhoria", type: "Plus", gender: "Men", price: 5200, available: 1, totalBeds: 5, occupiedBeds: 4, image: image("1600566753190-17f0baa2a6c3"), description: "Private rooms with a polished, all-inclusive managed experience in central Assiut.", commute: "8 min to Assiut University", amenities: ["High-speed Wi-Fi", "Weekly cleaning", "Air conditioning", "Premium furnishing", "Resident support", "Balcony"] },
  { slug: "assiut-university-house", code: "MSK-AST-002", name: "Assiut University House", area: "Assiut", neighborhood: "University District", type: "Comfort", gender: "Women", price: 4400, available: 1, totalBeds: 5, occupiedBeds: 4, image: image("1600210491369-e753d80a41f3"), description: "Quiet managed living for students and professionals who value privacy and attentive support.", commute: "7 min to Assiut University", amenities: ["High-speed Wi-Fi", "Weekly cleaning", "Air conditioning", "Premium furnishing", "Resident support", "Elevator"] },
  { slug: "tanta-central", code: "MSK-TNT-001", name: "Tanta Central", area: "Tanta", neighborhood: "Stadium District", type: "Essential", gender: "Men", price: 3000, available: 0, totalBeds: 5, occupiedBeds: 5, image: image("1600607688969-a5bfcd646154"), description: "Affordable organized housing with practical furnishing and predictable costs.", commute: "10 min to Tanta University", amenities: ["Wi-Fi", "Scheduled cleaning", "Maintenance", "Equipped kitchen", "Study desks"], partitioned: true },
  { slug: "tanta-gardens", code: "MSK-TNT-002", name: "Tanta Gardens", area: "Tanta", neighborhood: "University District", type: "Essential", gender: "Women", price: 2900, available: 1, totalBeds: 5, occupiedBeds: 4, image: image("1574362848149-11496d93a7c7"), description: "A straightforward shared home built around affordability, cleanliness, and support.", commute: "9 min to Tanta University", amenities: ["Wi-Fi", "Scheduled cleaning", "Maintenance", "Equipped kitchen", "House rules"], partitioned: true },
];

export const properties: Property[] = seeds.map((seed, index) => ({
  ...seed,
  id: String(index + 1),
  gallery:
    seed.gallery ??
    [seed.image, ...sharedGallery.filter((item) => item !== seed.image).slice(0, 2)],
  spaces: createSpaces(seed),
}));

export const areas = [
  "All areas",
  "New Cairo",
  "Nasr City",
  "Alexandria",
  "Mansoura",
  "Assiut",
  "Tanta",
] as const;

export const stats = {
  properties: 18,
  beds: 120,
  occupiedBeds: 100,
  occupancy: 83,
  revenue: 450000,
  availableBeds: 20,
  outstandingPayments: 9,
  outstandingAmount: 46200,
  maintenance: 6,
  expiringContracts: 8,
};

export function findSpace(bedId: string) {
  for (const property of properties) {
    const space = property.spaces.find((item) => item.id === bedId);
    if (space) return { property, space };
  }

  return undefined;
}
