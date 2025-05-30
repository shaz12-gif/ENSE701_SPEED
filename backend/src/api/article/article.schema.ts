import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleStatus = 'pending' | 'approved' | 'rejected';

@Schema({
  timestamps: true,
  collection: process.env.ARTICLES_COLLECTION || 'articles',
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

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: ArticleStatus;

  @Prop({ type: String })
  bibTeXSource?: string; // Store the raw BibTeX content

  @Prop()
  moderationComments?: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

// Log the collection name on schema creation
console.log(
  'Article schema collection name:',
  process.env.ARTICLES_COLLECTION || 'articles',
);
