import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors();
  await app.listen(3001);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log('Connected to MongoDB: speed-db.submitted_files');
}
bootstrap();
