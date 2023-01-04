import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const allowedOrigins = config.get<string[]>('allowedOrigins');

  const port = config.get<number>('port');

  app.enableCors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new ForbiddenException('Not allowed by CORS'), true);
    },
    methods: ['POST'],
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
