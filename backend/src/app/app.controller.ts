import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Practice, Evidence } from './interfaces';

@Controller('practices')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAllPractices(): Practice[] {
    return this.appService.getAllPractices();
  }

  @Get(':id/evidence')
  getPracticeEvidence(@Param('id') id: string): Evidence[] {
    return this.appService.getPracticeEvidence(id);
  }
}