import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { config } from 'dotenv';
config();

@Schema({
  collection: process.env.RATINGS_COLLECTION || 'ratings',
  timestamps: true,
})
export class Rating extends Document {
  @Prop({ required: true })
  contentId: string; // ID of article or evidence being rated

  @Prop({ required: true, default: 'article', enum: ['article', 'evidence'] })
  contentType: string; // 'article' or 'evidence'

  @Prop({ required: false })
  userId?: string; // Who submitted the rating (optional for anonymous)

  @Prop({ required: true, min: 1, max: 5 })
  value: number; // Rating value (1-5 stars)
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

// Create a compound index to prevent duplicate ratings from same user
RatingSchema.index({ contentId: 1, userId: 1 }, { unique: true, sparse: true });
