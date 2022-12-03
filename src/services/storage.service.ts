import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSError, S3 } from 'aws-sdk';
import { TConfig, TStorageConfig } from '../config/config.type';
import { PromiseResult } from 'aws-sdk/lib/request';
import * as Stream from 'stream';

@Injectable()
export class StorageService {
  private readonly s3: S3;
  private readonly BUCKET: string;

  constructor(private configService: ConfigService<TConfig>) {
    this.s3 = new S3({
      region: this.configService.get<TStorageConfig>('storage').S3region,
      endpoint: this.configService.get<TStorageConfig>('storage').S3endpoint,
      credentials: {
        accessKeyId: this.configService.get<TStorageConfig>('storage').S3key,
        secretAccessKey: this.configService.get<TStorageConfig>('storage').S3secret,
      },
    });

    this.BUCKET = this.configService.get<TStorageConfig>('storage').S3bucket;
  }

  async getBlob(key: string): Promise<PromiseResult<S3.GetObjectOutput, AWSError>> {
    const params = { Bucket: this.BUCKET, Key: key };
    const blob = await this.s3.getObject(params).promise();

    return blob;
  }

  async putBlob(
    blobName: string,
    blob: Buffer,
  ): Promise<PromiseResult<S3.PutObjectOutput, AWSError>> {
    const params = { Bucket: this.BUCKET, Key: blobName, Body: blob, ACL:'public-read' };
    const uploadedBlob = await this.s3.putObject(params).promise();

    return uploadedBlob;
  }

  async putStream(key: string, stream: Stream) {
    const file = await new Promise<S3.PutObjectOutput>((resolve, reject) => {
      const handleError = (error) => {
        reject(error);
      };
      const chunks: Buffer[] = [];

      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      stream.once('end', async () => {
        const fileBuffer = Buffer.concat(chunks);

        try {
          const uploaded = await this.putBlob(key, fileBuffer);

          resolve(uploaded);
        } catch (error) {
          handleError(new InternalServerErrorException(error));
        }
      });

      stream.on('error', (error) => handleError(new InternalServerErrorException(error)));
    });
    return file;
  }
}
