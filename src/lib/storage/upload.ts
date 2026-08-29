import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/** Magic bytes for basic content sniffing */
const SIGNATURES: { mime: string; bytes: number[] }[] = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF....WEBP checked below
];

export function detectImageMime(buffer: Buffer): string | null {
  for (const sig of SIGNATURES) {
    if (sig.bytes.every((b, i) => buffer[i] === b)) {
      if (sig.mime === "image/webp") {
        // WEBP: bytes 8-11 should be WEBP
        if (
          buffer.length > 11 &&
          buffer[8] === 0x57 &&
          buffer[9] === 0x45 &&
          buffer[10] === 0x42 &&
          buffer[11] === 0x50
        ) {
          return "image/webp";
        }
        continue;
      }
      return sig.mime;
    }
  }
  return null;
}

export interface UploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Secure local image upload for admin product photos.
 * Validates MIME via magic bytes, size, and stores with random name.
 */
export async function saveProductImage(
  file: File
): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" };
  }

  if (file.size > MAX_BYTES) {
    return { success: false, error: "File too large (max 5MB)" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectImageMime(buffer);

  if (!detected || !ALLOWED_MIME[detected]) {
    return { success: false, error: "Invalid or unsupported image type" };
  }

  // Also check declared type matches detected (do not trust alone)
  if (file.type && file.type !== detected && file.type !== "application/octet-stream") {
    // Allow slight mismatch only if detected is valid image
    if (!ALLOWED_MIME[detected]) {
      return { success: false, error: "File type mismatch" };
    }
  }

  const ext = ALLOWED_MIME[detected];
  const name = `${randomBytes(16).toString("hex")}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });

  const fullPath = path.join(uploadDir, name);
  await writeFile(fullPath, buffer);

  // Public URL path only — never expose filesystem path
  return {
    success: true,
    imageUrl: `/uploads/products/${name}`,
  };
}

export { MAX_BYTES, ALLOWED_MIME };
