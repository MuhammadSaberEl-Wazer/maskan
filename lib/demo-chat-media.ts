import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { DemoChatAttachment } from "@/lib/demo-session";

export const CHAT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const CHAT_VIDEO_MAX_BYTES = 25 * 1024 * 1024;
export const CHAT_MAX_ATTACHMENTS = 3;

type MediaDefinition = {
  kind: "image" | "video";
  extension: string;
  maxBytes: number;
  matches: (bytes: Uint8Array) => boolean;
};

const mediaDefinitions: Record<string, MediaDefinition> = {
  "image/jpeg": { kind: "image", extension: "jpg", maxBytes: CHAT_IMAGE_MAX_BYTES, matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { kind: "image", extension: "png", maxBytes: CHAT_IMAGE_MAX_BYTES, matches: (b) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => b[index] === value) },
  "image/webp": { kind: "image", extension: "webp", maxBytes: CHAT_IMAGE_MAX_BYTES, matches: (b) => textAt(b, 0, 4) === "RIFF" && textAt(b, 8, 4) === "WEBP" },
  "video/mp4": { kind: "video", extension: "mp4", maxBytes: CHAT_VIDEO_MAX_BYTES, matches: (b) => textAt(b, 4, 4) === "ftyp" },
  "video/webm": { kind: "video", extension: "webm", maxBytes: CHAT_VIDEO_MAX_BYTES, matches: (b) => b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3 },
};

export type DemoMediaScope = {
  channel: "support" | "unit";
  scopeKey: string;
  area?: string;
};

export type StoredDemoMedia = DemoMediaScope & {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  extension: string;
};

function textAt(bytes: Uint8Array, offset: number, length: number) {
  return String.fromCharCode(...bytes.slice(offset, offset + length));
}

function mediaDirectory() {
  return path.join(process.cwd(), ".demo-chat-media");
}

export async function validateDemoChatFile(file: File) {
  const definition = mediaDefinitions[file.type];
  if (!definition) throw new Error("unsupported_media_type");
  if (file.size <= 0 || file.size > definition.maxBytes) throw new Error("media_too_large");

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!definition.matches(bytes)) throw new Error("invalid_media_signature");
  return { definition, bytes };
}

export async function storeDemoChatFile(file: File, scope: DemoMediaScope): Promise<DemoChatAttachment> {
  const { definition, bytes } = await validateDemoChatFile(file);
  const id = randomUUID();
  const directory = mediaDirectory();
  const metadata: StoredDemoMedia = {
    ...scope,
    id,
    name: file.name.slice(0, 120),
    mimeType: file.type,
    size: file.size,
    extension: definition.extension,
  };

  await mkdir(directory, { recursive: true });
  await Promise.all([
    writeFile(path.join(directory, `${id}.${definition.extension}`), bytes),
    writeFile(path.join(directory, `${id}.json`), JSON.stringify(metadata), "utf8"),
  ]);

  return {
    id,
    name: metadata.name,
    kind: definition.kind,
    mimeType: metadata.mimeType,
    size: metadata.size,
    url: `/api/demo/chat/media/${id}`,
  };
}

export async function readDemoChatMedia(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  try {
    const directory = mediaDirectory();
    const metadata = JSON.parse(await readFile(path.join(directory, `${id}.json`), "utf8")) as StoredDemoMedia;
    if (metadata.id !== id || !mediaDefinitions[metadata.mimeType]) return null;
    const bytes = await readFile(path.join(directory, `${id}.${metadata.extension}`));
    return { metadata, bytes };
  } catch {
    return null;
  }
}
