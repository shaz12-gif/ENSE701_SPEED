import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Andrew Koves
 *  20126313
 * SPEED Group 3
 * This is a schema for the articles
 * it defines how articles are stored in the database
 */
export enum ArticleStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type ArticleDocument = Article & Document;

@Schema({
  timestamps: true,
  collection: process.env.ARTICLES_COLLECTION || 'articles',
})
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string;

  @Prop({ required: true })
  journal: string;

  @Prop({ required: true })
  year: number;

  @Prop({ type: String, default: null })
  doi?: string;

  @Prop({ type: String, default: null })
  url?: string;

  @Prop({ type: String, default: null })
  abstract?: string;

  @Prop({
    type: String,
    enum: Object.values(ArticleStatus),
    default: ArticleStatus.PENDING,
  })
  status: ArticleStatus;

  @Prop({ required: true, default: 'anonymous' })
  submittedBy: string;

  @Prop({ type: String, default: null })
  moderationComments?: string;

  @Prop({ type: Date, default: null })
  moderatedAt?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

// Add any indexes for performance
ArticleSchema.index({ title: 1 });
ArticleSchema.index({ status: 1 });
