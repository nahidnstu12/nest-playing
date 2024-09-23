import { NestFactory } from '@nestjs/core';
import { ZodFilter } from './@core/exception/zod.exception';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ZodFilter());
  await app.listen(6000);
}
bootstrap();
