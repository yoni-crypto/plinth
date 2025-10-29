import type { StorageProvider } from "./types";
import { createS3Adapter } from "./providers/s3";
import { createLocalAdapter } from "./providers/local";

let provider: StorageProvider | null = null;

function getProvider(): StorageProvider {
  if (provider) return provider;

  const storageProvider = process.env.STORAGE_PROVIDER || "local";

  switch (storageProvider) {
    case "s3":
    case "r2":
      provider = createS3Adapter();
      break;
    case "local":
      provider = createLocalAdapter();
      break;
    default:
      throw new Error(`Unknown storage provider: ${storageProvider}`);
  }

  return provider;
}

export function uploadFile(input: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}) {
  return getProvider().upload(input);
}

export function deleteFile(input: { key: string }) {
  return getProvider().delete(input);
}

export function getFileUrl(input: { key: string; signed?: boolean; expiresIn?: number }) {
  if (input.signed) {
    return getProvider().getSignedUrl({ key: input.key, expiresIn: input.expiresIn });
  }
  return Promise.resolve(getProvider().getPublicUrl({ key: input.key }));
}

export function validateFile(input: { size: number; type: string }): { valid: boolean; error?: string } {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || "10485760", 10); // 10MB
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || "image/*,application/pdf").split(",");

  if (input.size > maxSize) {
    return { valid: false, error: `File size exceeds maximum of ${maxSize / 1024 / 1024}MB` };
  }

  const isAllowed = allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      return input.type.startsWith(type.replace("/*", "/"));
    }
    return input.type === type;
  });

  if (!isAllowed) {
    return { valid: false, error: `File type ${input.type} is not allowed` };
  }

  return { valid: true };
}

export type { StorageProvider };
