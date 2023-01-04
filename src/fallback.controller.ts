import { All, Controller, ForbiddenException } from '@nestjs/common';

@Controller('/')
export class FallbackController {
  @All('*')
  fallback() {
    throw new ForbiddenException('Access denied');
  }
}
