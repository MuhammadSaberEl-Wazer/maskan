import type { ProductTier, RentalModel, RoomKind, StructureType, UnitGender } from "@/lib/data";
import type { Locale } from "@/lib/demo-accounts";

export { type Locale } from "@/lib/demo-accounts";

export function pick(locale: Locale, ar: string, en: string) {
  return locale === "ar" ? ar : en;
}

const areaAr: Record<string, string> = {
  "All areas": "كل المناطق",
  "New Cairo": "القاهرة الجديدة",
  "Nasr City": "مدينة نصر",
  Heliopolis: "مصر الجديدة",
  "El Shorouk": "الشروق",
  "El Obour": "العبور",
  "6th of October": "6 أكتوبر",
  "Sheikh Zayed": "الشيخ زايد",
  Maadi: "المعادي",
};

const propertyAr: Record<string, string> = {
  "ninety-residence": "سكن التسعين",
  "fifth-settlement-house": "وحدة التجمع الخامس",
  "lotus-corner": "ركن اللوتس",
  "rehab-gate": "بوابة الرحاب",
  "nasr-city-park": "سكن حديقة مدينة نصر",
  "makram-residence": "سكن مكرم",
  "roxy-residence": "سكن روكسي",
  "sheraton-house": "وحدة شيراتون",
  "shorouk-campus": "سكن جامعات الشروق",
  "obour-central": "سكن العبور",
  "october-campus": "سكن جامعات أكتوبر",
  "zayed-professionals": "سكن محترفي زايد",
  "lotus-family-home": "شقة أسرة اللوتس",
  "heliopolis-family-suite": "شقة أسرة مصر الجديدة",
  "shorouk-family-residence": "شقة أسرة الشروق",
  "obour-family-home": "شقة أسرة العبور",
  "october-family-garden": "شقة أسرة أكتوبر",
  "maadi-family-court": "شقة أسرة المعادي",
};

const neighborhoodAr: Record<string, string> = {
  "South 90th": "التسعين الجنوبي",
  "Fifth Settlement": "التجمع الخامس",
  Lotus: "اللوتس",
  "Al Rehab": "الرحاب",
  "7th District": "الحي السابع",
  "Makram Ebeid": "مكرم عبيد",
  Roxy: "روكسي",
  Sheraton: "شيراتون",
  "University District": "منطقة الجامعات",
  "First District": "الحي الأول",
  "Third District": "الحي الثالث",
  "Fifth District": "الحي الخامس",
  "8th District": "الحي الثامن",
  Korba: "الكوربة",
  Degla: "دجلة",
};

const amenityAr: Record<string, string> = {
  "High-speed Wi-Fi": "واي فاي سريع",
  "Wi-Fi": "واي فاي",
  "Weekly cleaning": "تنظيف أسبوعي",
  "Scheduled cleaning": "تنظيف بمواعيد ثابتة",
  "Air conditioning": "تكييف",
  "Equipped kitchen": "مطبخ مجهز",
  "Resident support": "دعم للمقيمين",
  "Smart access": "دخول ذكي",
  Maintenance: "صيانة",
  Balcony: "بلكونة",
  Workspace: "مساحة للشغل والمذاكرة",
  Elevator: "أسانسير",
  Doorman: "بواب",
  "Study desks": "مكاتب للمذاكرة",
  "House rules": "قواعد سكن واضحة",
  Laundry: "غسيل ملابس",
  "Garden view": "إطلالة على حديقة",
  "Premium furnishing": "فرش مميز",
  "Family ready": "مجهزة للأسرة",
  Parking: "مكان للسيارة",
  Security: "أمن",
};

export function areaLabel(value: string, locale: Locale) {
  return locale === "ar" ? areaAr[value] ?? value : value;
}

export function propertyName(slug: string, fallback: string, locale: Locale) {
  return locale === "ar" ? propertyAr[slug] ?? fallback : fallback;
}

export function neighborhoodLabel(value: string, locale: Locale) {
  return locale === "ar" ? neighborhoodAr[value] ?? value : value;
}

export function amenityLabel(value: string, locale: Locale) {
  return locale === "ar" ? amenityAr[value] ?? value : value;
}

export function tierLabel(value: ProductTier, locale: Locale) {
  if (locale === "en") return value;
  return { Essential: "اقتصادي", Comfort: "كومفورت", Plus: "بلس" }[value];
}

export function rentalModelLabel(value: RentalModel, locale: Locale) {
  if (locale === "en") return value === "Family apartment" ? "Full family apartment" : "Shared housing";
  return value === "Family apartment" ? "وحدة كاملة لأسرة" : "سكن مشترك";
}

export function genderLabel(value: UnitGender, locale: Locale) {
  if (locale === "en") return value;
  return { Men: "رجال", Women: "سيدات", Families: "أسر" }[value];
}

export function roomKindLabel(value: RoomKind, locale: Locale) {
  if (locale === "en") return value;
  return { "Private room": "أوضة خاصة", "Shared room": "أوضة مشتركة", "Full unit": "وحدة كاملة" }[value];
}

export function structureLabel(value: StructureType, locale: Locale) {
  if (locale === "en") return value;
  return { "Original room": "أوضة أصلية", "Partitioned room": "أوضة مقسّمة", "Entire apartment": "شقة كاملة" }[value];
}
