// backend/src/se-practice/se-practice.controller.ts
import { Controller, Get, Param, Post } from '@nestjs/common';
import { SEPracticeService } from './se-practice.service';

@Controller('api/practices')
export class SEPracticeController {
  constructor(private readonly sePracticeService: SEPracticeService) {}

  @Get()
  async findAll() {
    return this.sePracticeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sePracticeService.findOne(id);
  }

  @Post('samples')
  async createSamples() {
    return this.sePracticeService.createSamples();
  }
}