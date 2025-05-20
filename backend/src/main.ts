import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend development
  app.enableCors();
  
  await app.listen(3001);
  console.log(`Application is running on: http://localhost:3001`);
}
bootstrap();