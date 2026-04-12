import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private client: S3Client | null = null;
  private bucket = process.env.S3_BUCKET || '';
  private publicUrl = process.env.S3_PUBLIC_URL || '';

  private getClient(): S3Client | null {
    if (this.client) return this.client;
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION || 'us-east-1';
    const accessKey = process.env.S3_ACCESS_KEY;
    const secretKey = process.env.S3_SECRET_KEY;
    if (!accessKey || !secretKey || !this.bucket) {
      console.warn('S3 not configured; uploads will be stored locally or skipped.');
      return null;
    }
    this.client = new S3Client({
      region,
      ...(endpoint && { endpoint, forcePathStyle: true }),
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
    });
    return this.client;
  }

  async upload(key: string, body: Buffer, mimeType: string): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    await client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: mimeType,
      }),
    );
    return true;
  }

  async delete(key: string): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    await client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    return true;
  }

  getPublicUrl(key: string): string {
    if (this.publicUrl) return `${this.publicUrl.replace(/\/$/, '')}/${key}`;
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }
}
