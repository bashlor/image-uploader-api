import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSError, S3 } from 'aws-sdk';
import { TConfig, TStorageConfig } from '../config/config.type';
import { PromiseResult } from 'aws-sdk/lib/request';

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

  async putBlob(filename: string, file: any): Promise<PromiseResult<S3.PutObjectOutput, AWSError>> {
    const params = {
      Bucket: this.BUCKET,
      ContentType: file.mimetype,
      Key: filename,
      Body: file.buffer,
      ACL: 'public-read',
    };
    const uploadedFile = await this.s3.putObject(params).promise();

    return uploadedFile;
  }
}
