import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

/**
 * Bootstrap the NestJS application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log MongoDB connection state
  console.log('MongoDB connection state:', mongoose.connection.readyState);
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS with proper configuration
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Start the server
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend server running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
