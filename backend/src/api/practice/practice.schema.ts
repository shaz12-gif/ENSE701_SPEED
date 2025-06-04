import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PracticeDocument = Practice & Document;

@Schema({
  timestamps: true,
  collection: process.env.PRACTICES_COLLECTION || 'practices',
})
export class Practice {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const PracticeSchema = SchemaFactory.createForClass(Practice);
