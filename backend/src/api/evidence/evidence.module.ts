import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evidence, EvidenceSchema } from './evidence.schema';
import { EvidenceController } from './evidence.controller';
import { EvidenceService } from './evidence.service';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evidence.name, schema: EvidenceSchema },
    ]),
    ArticleModule,
  ],
  controllers: [EvidenceController],
  providers: [EvidenceService],
  exports: [EvidenceService],
})
export class EvidenceModule {}
