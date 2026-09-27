import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Repository {
  private s3: S3Client;
  private bucketName: string;

  constructor(bucketName?: string, region?: string) {
    this.s3 = new S3Client({ region: region || process.env.AWS_REGION || 'us-east-1' });
    this.bucketName = bucketName || process.env.DONATIONS_BUCKET_NAME || 'messmind-donations-storage';
  }

  async createPresignedUploadUrl(key: string, contentType: string = 'image/jpeg'): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(this.s3, command, { expiresIn: 300 });
  }

  getPublicUrl(key: string): string {
    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }
}
