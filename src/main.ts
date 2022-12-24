import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const allowedOrigins = config.get<string[]>('allowedOrigins');

  app.enableCors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), true);
    },
    methods: ['POST'],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
