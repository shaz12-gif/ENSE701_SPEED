import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Practice, PracticeSchema } from './practice.schema';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Practice.name,
        schema: PracticeSchema,
      },
    ]),
  ],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports: [PracticeService],
})
export class PracticeModule implements OnModuleInit {
  constructor(private readonly practiceService: PracticeService) {}

  // Seed the database with initial practices when the module initializes
  async onModuleInit() {
    await this.practiceService.seed();
  }
}
