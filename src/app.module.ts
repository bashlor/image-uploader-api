import * as path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FallbackController } from './fallback.controller';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './services/storage.service';
import config from './config/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, '../.env'),
      load: [config],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
  ],
  controllers: [AppController, FallbackController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    StorageService,
  ],
})
export class AppModule {}
