import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log MongoDB connection state
  console.log('MongoDB connection state:', mongoose.connection.readyState);
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  // Log environment variables
  console.log('Environment variables:');
  console.log('- DB_URI:', process.env.DB_URI ? 'Set (hidden)' : 'Not set');
  console.log('- DB_NAME:', process.env.DB_NAME);
  console.log('- ARTICLES_COLLECTION:', process.env.ARTICLES_COLLECTION);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  await app.listen(process.env.PORT || 3001);
  console.log(
    `Backend server running on: http://localhost:${process.env.PORT || 3001}`,
  );
}
bootstrap();
