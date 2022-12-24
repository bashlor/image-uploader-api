import {
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { TStorageConfig } from './config/config.type';

@Controller()
export class AppController {
  constructor(private readonly storage: StorageService, private readonly config: ConfigService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpg|jpeg|gif|bmp|tiff|webp|svg)',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 10,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file,
  ) {
    const bucketName = this.config.get<TStorageConfig>('storage').S3bucket;
    const s3Endpoint = this.config.get<TStorageConfig>('storage').S3endpoint;

    const key = `${uuid()}-${file.originalname}`;

    await this.storage.putBlob(key, file.buffer);

    return { link: `https://${bucketName}.${s3Endpoint}/${key}` };
  }

  @Get('/')
  async index() {
    throw new ForbiddenException('Access denied');
  }
}
