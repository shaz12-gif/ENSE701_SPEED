import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Moderation extends Document {
  @Prop({ required: true })
  articleId: string; // ID of article being moderated

  @Prop({ required: true })
  moderatorId: string; // Who approved/rejected

  @Prop({ required: true, enum: ['pending', 'approved', 'rejected'] })
  action: string; // Action taken on the article

  @Prop()
  notes?: string; // Optional notes from the moderator
}

export const ModerationSchema = SchemaFactory.createForClass(Moderation);
