import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ResearchType =
  | 'case study'
  | 'experiment'
  | 'survey'
  | 'literature review'
  | 'other';
export type ParticipantType = 'students' | 'professionals' | 'mixed' | 'other';
export type ResultType = 'agree' | 'disagree' | 'mixed';

@Schema({ timestamps: true })
export class Evidence extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Article', required: true })
  articleId: string;

  @Prop({ required: true })
  practiceId: string;

  @Prop({ required: true })
  claim: string;

  @Prop({ required: true })
  supportsClaim: boolean;

  @Prop({ required: false, enum: ['agree', 'disagree', 'mixed'] })
  result: ResultType;

  @Prop({
    required: false,
    enum: ['case study', 'experiment', 'survey', 'literature review', 'other'],
  })
  typeOfResearch?: ResearchType;

  @Prop({
    required: false,
    enum: ['students', 'professionals', 'mixed', 'other'],
  })
  participantType?: ParticipantType;

  @Prop({ required: false })
  analyst?: string;

  @Prop({ required: false })
  analystComments?: string;

  @Prop({ required: false })
  title?: string;

  @Prop({ required: false })
  source?: string;

  @Prop({ required: false })
  year?: number;

  @Prop({ required: false })
  description?: string;
}

export const EvidenceSchema = SchemaFactory.createForClass(Evidence);
