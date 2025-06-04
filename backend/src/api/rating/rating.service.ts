import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from './rating.schema';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(@InjectModel(Rating.name) private ratingModel: Model<Rating>) {}

  async addRating(createRatingDto: CreateRatingDto): Promise<Rating> {
    const newRating = new this.ratingModel(createRatingDto);
    return await newRating.save();
  }

  async getContentRatings(
    contentId: string,
    contentType: string,
  ): Promise<Rating[]> {
    return await this.ratingModel.find({ contentId, contentType }).exec();
  }

  async getAverageRating(
    contentId: string,
    contentType: string = 'article',
  ): Promise<number> {
    const result = await this.ratingModel
      .aggregate([
        { $match: { contentId, contentType } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$value' },
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    if (result.length === 0) {
      return 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return result[0].averageRating;
  }

  async getRatingsCount(
    contentId: string,
    contentType: string = 'article',
  ): Promise<number> {
    return this.ratingModel.countDocuments({ contentId, contentType }).exec();
  }

  async getUserRating(
    contentId: string,
    userId: string,
  ): Promise<Rating | null> {
    return await this.ratingModel.findOne({ contentId, userId }).exec();
  }
}
