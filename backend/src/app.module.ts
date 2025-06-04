/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './api/article/article.module';
import { EvidenceModule } from './api/evidence/evidence.module';
import { ModerationModule } from './api/moderation/moderation.module';
import { RatingModule } from './api/rating/rating.module';
import { SearchModule } from './api/search/search.module';
import { PracticeModule } from './api/practice/practice.module';

/**
 * Root application module
 *
 * Configures environment variables, database connection,
 * and imports all feature modules
 */
@Module({
  imports: [
    // Configuration module - loads environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make config globally available
    }),

    // Database connection
    MongooseModule.forRoot(process.env.DB_URI, {
      dbName: process.env.DB_NAME,
      // Connection settings
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB connection established');
        });
        connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });
        return connection;
      },
    }),

    // Feature modules
    ArticleModule,
    EvidenceModule,
    ModerationModule,
    RatingModule,
    SearchModule,
    PracticeModule,
  ],
})
export class AppModule {}
