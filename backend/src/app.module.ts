import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './api/article/article.module';
import { EvidenceModule } from './api/evidence/evidence.module';
import { ModerationModule } from './api/moderation/moderation.module';
import { RatingModule } from './api/rating/rating.module';
import { SearchModule } from './api/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make config globally available
    }),
    MongooseModule.forRoot(process.env.DB_URI, {
      dbName: process.env.DB_NAME, // Use the DB_NAME environment variable
    }),
    ArticleModule,
    EvidenceModule,
    ModerationModule,
    RatingModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
