// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SEPracticeModule } from '../se-practice/se-practice.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.DB_URI || configService.get<string>('DB_URI') || 'mongodb://localhost:27017/default-db',
      }),
      inject: [ConfigService],
    }),
    SEPracticeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}