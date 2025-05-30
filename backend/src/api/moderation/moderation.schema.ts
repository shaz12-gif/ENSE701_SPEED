import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

/**
 * Moderation document type
 */
export type ModerationDocument = Moderation & Document;

/**
 * Moderation schema definition
 */
@Schema({ timestamps: true })
export class Moderation {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  articleId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  moderatorId: string;

  @Prop({ required: true, enum: ['approved', 'rejected'] })
  action: string;

  @Prop({ type: String })
  notes?: string;
}

export const ModerationSchema = SchemaFactory.createForClass(Moderation);
