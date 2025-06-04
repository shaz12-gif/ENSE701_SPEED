import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false, // This is crucial to fix your "property should not exist" errors
      skipMissingProperties: true,
    }),
  );

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
