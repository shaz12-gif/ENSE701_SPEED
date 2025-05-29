import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { config } from 'dotenv';
config();

export type ArticleStatus = 'pending' | 'approved' | 'rejected';

@Schema({
  collection: process.env.ARTICLES_COLLECTION || 'articles',
  timestamps: true,
})
export class Article extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string;

  @Prop({ required: true })
  journal: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  volume?: string;

  @Prop()
  number?: string;

  @Prop()
  pages?: string;

  @Prop()
  doi?: string;

  @Prop({ default: 'anonymous' })
  submittedBy?: string;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: ArticleStatus;

  @Prop()
  moderatorId?: string;

  @Prop()
  moderationDate?: Date;

  @Prop()
  moderationNotes?: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
