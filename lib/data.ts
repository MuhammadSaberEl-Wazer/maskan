export type ProductTier = "Essential" | "Comfort" | "Plus";
export type RentalModel = "Shared housing" | "Family apartment";
export type UnitGender = "Men" | "Women" | "Families";
export type RoomKind = "Private room" | "Shared room" | "Full unit";
export type StructureType = "Original room" | "Partitioned room" | "Entire apartment";

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
  rentalModel: RentalModel;
  gender: UnitGender;
  price: number;
  available: number;
  totalBeds: number;
  occupiedBeds: number;
  bedrooms?: number;
  bathrooms?: number;
  image: string;
  gallery: string[];
  description: string;
  commute: string;
  amenities: string[];
  spaces: Space[];
};

export type DurationMonths = 1 | 3 | 6 | 12;

export const durationOptions: Array<{ months: DurationMonths; label: string; discount: number }> = [
  { months: 1, label: "1 month", discount: 0 },
  { months: 3, label: "3 months", discount: 0.04 },
  { months: 6, label: "6 months", discount: 0.07 },
  { months: 12, label: "12 months", discount: 0.1 },
];

export function getBookingQuote(basePrice: number, duration: DurationMonths) {
  const rule = durationOptions.find((option) => option.months === duration)!;
  const monthlyPrice = Math.round((basePrice * (1 - rule.discount)) / 50) * 50;
  const depositAmount = monthlyPrice;
  return { monthlyPrice, depositAmount, rentTotal: monthlyPrice * duration, discount: rule.discount };
}

type PropertySeed = Omit<Property, "id" | "spaces" | "gallery"> & { gallery?: string[]; partitioned?: boolean };

const image = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=86`;
const sharedGallery = [image("1600607687920-4e2a09cf159d"), image("1600566753190-17f0baa2a6c3"), image("1554995207-c18c203602cb")];

function createSpaces(seed: PropertySeed): Space[] {
  const code = seed.code.toLowerCase();
  if (seed.rentalModel === "Family apartment") {
    return [{ id: `unit-${code}`, roomCode: "Entire apartment", bedCode: "FULL", kind: "Full unit", structure: "Entire apartment", capacity: Math.max(2, (seed.bedrooms ?? 2) * 2), availableBeds: seed.available > 0 ? 1 : 0, monthlyPrice: seed.price, ensuite: (seed.bathrooms ?? 1) > 1 }];
  }

  const privatePrice = seed.price + (seed.type === "Plus" ? 2200 : seed.type === "Comfort" ? 1500 : 900);
  const sharedCapacity = seed.type === "Essential" ? 3 : 2;
  return [
    { id: `bed-${code}-a1`, roomCode: "Room A", bedCode: "A1", kind: "Private room", structure: "Original room", capacity: 1, availableBeds: seed.available > 0 ? 1 : 0, monthlyPrice: privatePrice, ensuite: seed.type === "Plus" },
    { id: `bed-${code}-b1`, roomCode: "Room B", bedCode: "B1", kind: "Shared room", structure: seed.partitioned ? "Partitioned room" : "Original room", capacity: sharedCapacity, availableBeds: Math.max(0, Math.min(seed.available - 1, sharedCapacity)), monthlyPrice: seed.price, ensuite: false },
  ];
}

const seeds: PropertySeed[] = [
  { slug: "ninety-residence", code: "MSK-NC-001", name: "Ninety Residence", area: "New Cairo", neighborhood: "South 90th", type: "Plus", rentalModel: "Shared housing", gender: "Women", price: 7500, available: 2, totalBeds: 7, occupiedBeds: 5, image: image("1600210492486-724fe5c67fb0"), description: "Private-first managed living close to New Cairo business and university districts.", commute: "8 min to South 90th offices", amenities: ["High-speed Wi-Fi", "Weekly cleaning", "Air conditioning", "Equipped kitchen", "Resident support", "Smart access"] },
  { slug: "fifth-settlement-house", code: "MSK-NC-002", name: "Fifth Settlement House", area: "New Cairo", neighborhood: "Fifth Settlement", type: "Comfort", rentalModel: "Shared housing", gender: "Men", price: 5900, available: 2, totalBeds: 7, occupiedBeds: 5, image: image("1600566753086-00f18fb6b3ea"), description: "A calm, practical shared residence for professionals with generous common areas.", commute: "12 min to AUC", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Equipped kitchen", "Maintenance", "Balcony"] },
  { slug: "lotus-corner", code: "MSK-NC-003", name: "Lotus Corner", area: "New Cairo", neighborhood: "Lotus", type: "Comfort", rentalModel: "Shared housing", gender: "Women", price: 5600, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1600607687939-ce8a6c25118c"), description: "Bright managed rooms with a balanced shared-home layout.", commute: "10 min to North 90th", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Equipped kitchen", "Maintenance", "Workspace"] },
  { slug: "rehab-gate", code: "MSK-NC-004", name: "Rehab Gate", area: "New Cairo", neighborhood: "Al Rehab", type: "Plus", rentalModel: "Shared housing", gender: "Men", price: 8200, available: 2, totalBeds: 7, occupiedBeds: 5, image: image("1600573472550-8090b5e0745e"), description: "Premium private-heavy managed living with dependable resident support.", commute: "6 min to Gate 13", amenities: ["High-speed Wi-Fi", "Weekly cleaning", "Air conditioning", "Premium furnishing", "Resident support", "Elevator"] },
  { slug: "nasr-city-park", code: "MSK-NS-001", name: "Nasr City Park", area: "Nasr City", neighborhood: "7th District", type: "Comfort", rentalModel: "Shared housing", gender: "Men", price: 4500, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1502672260266-1c1ef2d93688"), description: "Managed shared living for students and young professionals near everyday services.", commute: "7 min to Abbas El Akkad", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Maintenance", "Equipped kitchen", "Elevator"] },
  { slug: "makram-residence", code: "MSK-NS-002", name: "Makram Residence", area: "Nasr City", neighborhood: "Makram Ebeid", type: "Comfort", rentalModel: "Shared housing", gender: "Women", price: 4800, available: 1, totalBeds: 8, occupiedBeds: 7, image: image("1493809842364-78817add7ffb"), description: "An organized women-only residence with strong transport access.", commute: "4 min to Makram Ebeid", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Maintenance", "Equipped kitchen", "Doorman"] },
  { slug: "roxy-residence", code: "MSK-HEL-001", name: "Roxy Residence", area: "Heliopolis", neighborhood: "Roxy", type: "Plus", rentalModel: "Shared housing", gender: "Women", price: 6800, available: 1, totalBeds: 6, occupiedBeds: 5, image: image("1560185008-b033106af5c3"), description: "A polished residence with private rooms in the heart of Heliopolis.", commute: "5 min to Roxy Square", amenities: ["High-speed Wi-Fi", "Weekly cleaning", "Air conditioning", "Premium furnishing", "Resident support", "Elevator"] },
  { slug: "sheraton-house", code: "MSK-HEL-002", name: "Sheraton House", area: "Heliopolis", neighborhood: "Sheraton", type: "Comfort", rentalModel: "Shared housing", gender: "Men", price: 5700, available: 2, totalBeds: 7, occupiedBeds: 5, image: image("1600566753051-f0b89df2dd90"), description: "Comfortable shared housing with quick access to work and airport corridors.", commute: "9 min to Cairo Airport", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Maintenance", "Equipped kitchen", "Balcony"] },
  { slug: "shorouk-campus", code: "MSK-SH-001", name: "Shorouk Campus", area: "El Shorouk", neighborhood: "University District", type: "Essential", rentalModel: "Shared housing", gender: "Women", price: 3500, available: 2, totalBeds: 8, occupiedBeds: 6, image: image("1554995207-c18c203602cb"), description: "Practical managed accommodation close to universities in El Shorouk.", commute: "8 min to BUE", amenities: ["Wi-Fi", "Scheduled cleaning", "Maintenance", "Equipped kitchen", "Study desks", "House rules"], partitioned: true },
  { slug: "obour-central", code: "MSK-OB-001", name: "Obour Central", area: "El Obour", neighborhood: "First District", type: "Essential", rentalModel: "Shared housing", gender: "Men", price: 3200, available: 2, totalBeds: 8, occupiedBeds: 6, image: image("1586023492125-27b2c045efd7"), description: "Affordable organized housing near El Obour industrial and education hubs.", commute: "10 min to Obour University", amenities: ["Wi-Fi", "Scheduled cleaning", "Maintenance", "Equipped kitchen", "Study desks"], partitioned: true },
  { slug: "october-campus", code: "MSK-OCT-001", name: "October Campus", area: "6th of October", neighborhood: "7th District", type: "Comfort", rentalModel: "Shared housing", gender: "Women", price: 4300, available: 1, totalBeds: 7, occupiedBeds: 6, image: image("1564013799919-ab600027ffc6"), description: "Student-friendly managed housing near October universities.", commute: "7 min to MUST", amenities: ["Wi-Fi", "Weekly cleaning", "Air conditioning", "Maintenance", "Study desks", "Equipped kitchen"] },
  { slug: "zayed-professionals", code: "MSK-ZY-001", name: "Zayed Professionals", area: "Sheikh Zayed", neighborhood: "8th District", type: "Plus", rentalModel: "Shared housing", gender: "Men", price: 7800, available: 1, totalBeds: 6, occupiedBeds: 5, image: image("1600566753190-17f0baa2a6c3"), description: "Private-first managed accommodation for professionals in Sheikh Zayed.", commute: "8 min to Arkan", amenities: ["High-speed Wi-Fi", "Weekly cleaning", "Air conditioning", "Premium furnishing", "Resident support", "Parking"] },
  { slug: "lotus-family-home", code: "MSK-FAM-NC-001", name: "Lotus Family Home", area: "New Cairo", neighborhood: "Lotus", type: "Plus", rentalModel: "Family apartment", gender: "Families", price: 28000, available: 1, totalBeds: 1, occupiedBeds: 0, bedrooms: 3, bathrooms: 2, image: image("1600607688969-a5bfcd646154"), description: "A complete furnished three-bedroom apartment offered to one family under one contract.", commute: "10 min to North 90th", amenities: ["Family ready", "High-speed Wi-Fi", "Air conditioning", "Equipped kitchen", "Maintenance", "Parking"] },
  { slug: "heliopolis-family-suite", code: "MSK-FAM-HEL-001", name: "Heliopolis Family Suite", area: "Heliopolis", neighborhood: "Korba", type: "Plus", rentalModel: "Family apartment", gender: "Families", price: 24000, available: 1, totalBeds: 1, occupiedBeds: 0, bedrooms: 3, bathrooms: 2, image: image("1574362848149-11496d93a7c7"), description: "A full family apartment in Korba with managed maintenance and one transparent monthly price.", commute: "5 min to Korba Square", amenities: ["Family ready", "Air conditioning", "Equipped kitchen", "Maintenance", "Elevator", "Doorman"] },
  { slug: "shorouk-family-residence", code: "MSK-FAM-SH-001", name: "Shorouk Family Residence", area: "El Shorouk", neighborhood: "Third District", type: "Comfort", rentalModel: "Family apartment", gender: "Families", price: 18000, available: 1, totalBeds: 1, occupiedBeds: 0, bedrooms: 3, bathrooms: 2, image: image("1600210491369-e753d80a41f3"), description: "A quiet complete apartment for a family seeking a managed long-term stay in El Shorouk.", commute: "9 min to City Centre Shorouk", amenities: ["Family ready", "Air conditioning", "Equipped kitchen", "Maintenance", "Balcony", "Security"] },
  { slug: "obour-family-home", code: "MSK-FAM-OB-001", name: "Obour Family Home", area: "El Obour", neighborhood: "Fifth District", type: "Essential", rentalModel: "Family apartment", gender: "Families", price: 15000, available: 1, totalBeds: 1, occupiedBeds: 0, bedrooms: 2, bathrooms: 1, image: image("1522708323590-d24dbb6b0267"), description: "A practical furnished two-bedroom apartment rented as one complete family unit.", commute: "8 min to Obour Market", amenities: ["Family ready", "Equipped kitchen", "Maintenance", "Balcony", "Security"] },
  { slug: "october-family-garden", code: "MSK-FAM-OCT-001", name: "October Family Garden", area: "6th of October", neighborhood: "First District", type: "Comfort", rentalModel: "Family apartment", gender: "Families", price: 17000, available: 1, totalBeds: 1, occupiedBeds: 0, bedrooms: 3, bathrooms: 2, image: image("1615874694520-474822394e73"), description: "A furnished family apartment with a clear full-unit rent and managed support.", commute: "8 min to Mall of Arabia", amenities: ["Family ready", "Air conditioning", "Equipped kitchen", "Maintenance", "Parking", "Security"] },
  { slug: "maadi-family-court", code: "MSK-FAM-MD-001", name: "Maadi Family Court", area: "Maadi", neighborhood: "Degla", type: "Plus", rentalModel: "Family apartment", gender: "Families", price: 26000, available: 1, totalBeds: 1, occupiedBeds: 0, bedrooms: 3, bathrooms: 2, image: image("1600566753086-00f18fb6b3ea"), description: "A complete premium family apartment in Degla with managed service and support.", commute: "6 min to Road 9", amenities: ["Family ready", "High-speed Wi-Fi", "Air conditioning", "Equipped kitchen", "Maintenance", "Parking"] },
];

export const properties: Property[] = seeds.map((seed, index) => ({ ...seed, id: String(index + 1), gallery: seed.gallery ?? [seed.image, ...sharedGallery.filter((item) => item !== seed.image).slice(0, 2)], spaces: createSpaces(seed) }));

export const areas = ["All areas", "New Cairo", "Nasr City", "Heliopolis", "El Shorouk", "El Obour", "6th of October", "Sheikh Zayed", "Maadi"] as const;

const totalInventory = properties.reduce((sum, property) => sum + property.totalBeds, 0);
const occupiedInventory = properties.reduce((sum, property) => sum + property.occupiedBeds, 0);

export const stats = { properties: properties.length, beds: totalInventory, occupiedBeds: occupiedInventory, occupancy: Math.round((occupiedInventory / totalInventory) * 100), revenue: 465000, availableBeds: totalInventory - occupiedInventory, outstandingPayments: 9, outstandingAmount: 46200, maintenance: 6, expiringContracts: 8 };

export function findSpace(bedId: string) {
  for (const property of properties) {
    const space = property.spaces.find((item) => item.id === bedId);
    if (space) return { property, space };
  }
  return undefined;
}
