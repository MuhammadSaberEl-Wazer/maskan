import type { DemoSession } from "@/lib/demo-session";
import type { Property } from "@/lib/data";

export type CameraAccessLevel = 1 | 2 | 3 | 4 | 5;

export type DemoCamera = {
  id: string;
  propertySlug: string;
  propertyCode: string;
  propertyName: string;
  area: string;
  labelAr: string;
  labelEn: string;
  image: string;
  status: "online" | "maintenance";
  minimumLevel: CameraAccessLevel;
};

const cameraPoints: Array<Pick<DemoCamera, "labelAr" | "labelEn" | "minimumLevel">> = [
  { labelAr: "المدخل الرئيسي", labelEn: "Main entrance", minimumLevel: 1 },
  { labelAr: "منطقة المعيشة المشتركة", labelEn: "Shared living area", minimumLevel: 1 },
  { labelAr: "ممر الغرف المشترك", labelEn: "Shared room corridor", minimumLevel: 2 },
  { labelAr: "مدخل الخدمة", labelEn: "Service entrance", minimumLevel: 3 },
  { labelAr: "نقطة المرافق المشتركة", labelEn: "Shared utilities access", minimumLevel: 4 },
  { labelAr: "المحيط الخارجي للمبنى", labelEn: "Building exterior perimeter", minimumLevel: 5 },
];

export function cameraAccessLevel(session: DemoSession): CameraAccessLevel {
  if (session.role === "admin") return 5;
  if (session.role === "area_manager") return 4;
  if (session.role === "staff") return 3;
  if (session.isUnitRepresentative) return 2;
  return 1;
}

export function camerasForProperties(properties: Property[], level: CameraAccessLevel): DemoCamera[] {
  return properties.flatMap((property, propertyIndex) =>
    cameraPoints
      .filter((point) => point.minimumLevel <= level)
      .map((point, cameraIndex) => ({
        id: `${property.code}-CAM-${String(cameraIndex + 1).padStart(2, "0")}`,
        propertySlug: property.slug,
        propertyCode: property.code,
        propertyName: property.name,
        area: property.area,
        labelAr: point.labelAr,
        labelEn: point.labelEn,
        image: property.gallery[cameraIndex % property.gallery.length],
        status: level >= 4 && (propertyIndex + cameraIndex) % 19 === 0 ? "maintenance" as const : "online" as const,
        minimumLevel: point.minimumLevel,
      })),
  );
}
