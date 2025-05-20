// backend/src/se-practice/se-practice.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SEPracticeDocument = SEPractice & Document;

@Schema()
export class SEPractice {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: [] })
  evidences: string[];
}

export const SEPracticeSchema = SchemaFactory.createForClass(SEPractice);