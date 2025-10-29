export interface StorageProvider {
  upload(input: {
    key: string;
    body: Buffer | Uint8Array;
    contentType: string;
  }): Promise<{ key: string; url: string }>;

  delete(input: { key: string }): Promise<void>;

  getSignedUrl(input: {
    key: string;
    expiresIn?: number;
  }): Promise<string>;

  getPublicUrl(input: { key: string }): string;
}
