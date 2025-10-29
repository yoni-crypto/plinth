import { promises as fs } from "fs";
import path from "path";
import type { StorageProvider } from "../types";

export function createLocalAdapter(): StorageProvider {
  const uploadDir = process.env.LOCAL_STORAGE_DIR || "./uploads";

  async function ensureDir(filePath: string) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
  }

  return {
    async upload({ key, body, contentType }) {
      const filePath = path.join(uploadDir, key);
      await ensureDir(filePath);
      await fs.writeFile(filePath, body);
      return { key, url: `/api/storage/${key}` };
    },

    async delete({ key }) {
      const filePath = path.join(uploadDir, key);
      await fs.unlink(filePath).catch(() => {});
    },

    async getSignedUrl({ key }) {
      return `/api/storage/${key}`;
    },

    getPublicUrl({ key }) {
      return `/api/storage/${key}`;
    },
  };
}
