import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('api/ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async addRating(@Body() createRatingDto: CreateRatingDto) {
    const rating = await this.ratingService.addRating(createRatingDto);
    return {
      success: true,
      data: rating,
    };
  }

  @Get('average/:contentId')
  async getAverageRating(
    @Param('contentId') contentId: string,
    @Query('type') contentType: string = 'article',
  ) {
    const average = await this.ratingService.getAverageRating(
      contentId,
      contentType,
    );
    const count = await this.ratingService.getRatingsCount(
      contentId,
      contentType,
    );

    return {
      success: true,
      data: {
        contentId,
        contentType,
        averageRating: average,
        count,
      },
    };
  }
}
