import { Controller, Get, Param } from '@nestjs/common';
import { PracticesService } from './practices.service';
import { Practice, Evidence } from '../interfaces';

@Controller('practices')
export class PracticesController {
  constructor(private readonly practicesService: PracticesService) {}

  @Get()
  getAllPractices(): Practice[] {
    return this.practicesService.getAllPractices();
  }

  @Get(':id/evidence')
  getPracticeEvidence(@Param('id') id: string): Evidence[] {
    return this.practicesService.getPracticeEvidence(id);
  }
}