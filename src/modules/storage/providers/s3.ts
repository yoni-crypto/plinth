import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { StorageProvider } from "../types";

export function createS3Adapter(): StorageProvider {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION || "us-east-1";
  const accessKeyId = process.env.S3_ACCESS_KEY;
  const secretAccessKey = process.env.S3_SECRET_KEY;
  const endpoint = process.env.S3_ENDPOINT;

  if (!bucket) throw new Error("S3_BUCKET is required");

  const client = new S3Client({
    region,
    endpoint,
    credentials:
      accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
  });

  const publicBaseUrl = process.env.S3_PUBLIC_URL || `https://${bucket}.s3.${region}.amazonaws.com`;

  return {
    async upload({ key, body, contentType }) {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        })
      );
      return { key, url: `${publicBaseUrl}/${key}` };
    },

    async delete({ key }) {
      await client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
    },

    async getSignedUrl({ key, expiresIn = 3600 }) {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      return getSignedUrl(client, command, { expiresIn });
    },

    getPublicUrl({ key }) {
      return `${publicBaseUrl}/${key}`;
    },
  };
}
