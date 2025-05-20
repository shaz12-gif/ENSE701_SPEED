// backend/src/se-practice/se-practice.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SEPractice, SEPracticeSchema } from './se-practice.model';
import { SEPracticeService } from './se-practice.service';
import { SEPracticeController } from './se-practice.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SEPractice.name, schema: SEPracticeSchema }]),
  ],
  providers: [SEPracticeService],
  controllers: [SEPracticeController],
})
export class SEPracticeModule {}