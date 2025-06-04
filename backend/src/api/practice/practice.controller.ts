/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PracticeService } from './practice.service';

@Controller('api/practices')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Get()
  async findAll() {
    try {
      const practices = await this.practiceService.findAll();

      return {
        success: true,
        data: practices,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to fetch practices: ${error.message}`,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const practice = await this.practiceService.findById(id);

      if (!practice) {
        throw new NotFoundException(`Practice with ID ${id} not found`);
      }

      return {
        success: true,
        data: practice,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to fetch practice: ${error.message}`,
      };
    }
  }
}
