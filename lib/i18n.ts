import type { ProductTier, RoomKind, StructureType, UnitGender } from "@/lib/data";
import type { Locale } from "@/lib/demo-accounts";

export { type Locale } from "@/lib/demo-accounts";

export function pick(locale: Locale, ar: string, en: string) {
  return locale === "ar" ? ar : en;
}

const areaAr: Record<string, string> = {
  "All areas": "كل المناطق",
  "New Cairo": "القاهرة الجديدة",
  "Nasr City": "مدينة نصر",
  Alexandria: "الإسكندرية",
  Mansoura: "المنصورة",
  Assiut: "أسيوط",
  Tanta: "طنطا",
};

const propertyAr: Record<string, string> = {
  "ninety-residence": "سكن التسعين",
  "fifth-settlement-house": "وحدة التجمع الخامس",
  "lotus-corner": "ركن اللوتس",
  "rehab-gate": "بوابة الرحاب",
  "nasr-city-park": "سكن حديقة مدينة نصر",
  "makram-residence": "سكن مكرم",
  "rabaah-house": "وحدة رابعة",
  "zahraa-court": "دار زهراء مدينة نصر",
  "smouha-court": "دار سموحة",
  "kafr-abdo-home": "وحدة كفر عبده",
  "sidi-gaber-house": "وحدة سيدي جابر",
  "mansoura-garden": "حدائق المنصورة",
  "mansoura-university-residence": "سكن جامعة المنصورة",
  "mansoura-central": "سكن وسط المنصورة",
  "assiut-nile": "وحدة النيل أسيوط",
  "assiut-university-house": "وحدة جامعة أسيوط",
  "tanta-central": "سكن وسط طنطا",
  "tanta-gardens": "حدائق طنطا",
};

const neighborhoodAr: Record<string, string> = {
  "South 90th": "التسعين الجنوبي",
  "Fifth Settlement": "التجمع الخامس",
  Lotus: "اللوتس",
  "Al Rehab": "الرحاب",
  "7th District": "الحي السابع",
  "Makram Ebeid": "مكرم عبيد",
  "6th District": "الحي السادس",
  "Zahraa Nasr City": "زهراء مدينة نصر",
  Smouha: "سموحة",
  "Kafr Abdo": "كفر عبده",
  "Sidi Gaber": "سيدي جابر",
  "El Mashaya": "المشاية",
  "El Gomhoria": "الجمهورية",
  "Stadium District": "منطقة الاستاد",
  "University District": "منطقة الجامعات",
  "City Center": "وسط المدينة",
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

export function genderLabel(value: UnitGender, locale: Locale) {
  if (locale === "en") return value;
  return value === "Men" ? "رجال" : "سيدات";
}

export function roomKindLabel(value: RoomKind, locale: Locale) {
  if (locale === "en") return value;
  return value === "Private room" ? "أوضة خاصة" : "أوضة مشتركة";
}

export function structureLabel(value: StructureType, locale: Locale) {
  if (locale === "en") return value;
  return value === "Original room" ? "أوضة أصلية" : "أوضة مقسّمة";
}
