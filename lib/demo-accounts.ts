export type Locale = "ar" | "en";
export type DemoRole = "resident" | "staff" | "area_manager" | "admin";

export type DemoAccount = {
  id: string;
  fullName: string;
  fullNameAr: string;
  email: string;
  password: string;
  role: DemoRole;
  preferredLanguage: Locale;
  gender: "male" | "female";
  isUnitRepresentative: boolean;
  area?: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    id: "demo-resident-omar",
    fullName: "Omar Hassan",
    fullNameAr: "عمر حسن",
    email: "resident@maskan.demo",
    password: "Maskan123!",
    role: "resident",
    preferredLanguage: "ar",
    gender: "male",
    isUnitRepresentative: false,
  },
  {
    id: "demo-representative-ahmed",
    fullName: "Ahmed Samir",
    fullNameAr: "أحمد سمير",
    email: "representative@maskan.demo",
    password: "Maskan123!",
    role: "resident",
    preferredLanguage: "ar",
    gender: "male",
    isUnitRepresentative: true,
  },
  {
    id: "demo-staff-sara",
    fullName: "Sara Adel",
    fullNameAr: "سارة عادل",
    email: "staff@maskan.demo",
    password: "Maskan123!",
    role: "staff",
    preferredLanguage: "ar",
    gender: "female",
    isUnitRepresentative: false,
    area: "Heliopolis",
  },
  {
    id: "demo-manager-youssef",
    fullName: "Youssef Nabil",
    fullNameAr: "يوسف نبيل",
    email: "manager@maskan.demo",
    password: "Maskan123!",
    role: "area_manager",
    preferredLanguage: "ar",
    gender: "male",
    isUnitRepresentative: false,
    area: "Nasr City",
  },
  {
    id: "demo-admin-nadia",
    fullName: "Nadia Mostafa",
    fullNameAr: "نادية مصطفى",
    email: "admin@maskan.demo",
    password: "Maskan123!",
    role: "admin",
    preferredLanguage: "en",
    gender: "female",
    isUnitRepresentative: false,
  },
];

export const roleLabels: Record<DemoRole, { ar: string; en: string }> = {
  resident: { ar: "مقيم", en: "Resident" },
  staff: { ar: "موظف تشغيل", en: "Operations staff" },
  area_manager: { ar: "مدير منطقة", en: "Area manager" },
  admin: { ar: "مدير النظام", en: "Administrator" },
};

export function getDemoAccount(idOrEmail: string) {
  return demoAccounts.find(
    (account) => account.id === idOrEmail || account.email.toLowerCase() === idOrEmail.toLowerCase(),
  );
}
