import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { config } from 'dotenv';
config();

/**
 * Author: Andrew Koves
 * ID: 20126313
 *
 * Schema definition for uploaded evidence files and metadata.
 * Supports both file uploads and evidence-only submissions.
 */
@Schema({
  collection: process.env.EVIDENCE_COLLECTION,
  timestamps: true,
})
export class uploadedfile extends Document {
  // Evidence metadata
  @Prop({ required: true })
  practiceId: string;

  @Prop({ required: true })
  claimId: string;

  @Prop({ required: true })
  supportsClaim: boolean;

  @Prop({ required: false })
  title: string;

  @Prop({ required: false })
  source: string;

  @Prop({ required: false })
  year: number;

  @Prop({ required: false })
  description?: string;

  // New reference fields
  @Prop({ required: false })
  articleId?: string;

  @Prop({ required: false })
  evidenceId?: string;

  // File-specific properties (optional)
  @Prop({ required: false })
  filename?: string;

  @Prop({ type: Buffer, required: false })
  data?: Buffer; // For PDF files

  @Prop({ required: false })
  textData?: string; // For BibTeX files

  @Prop({ required: false })
  mimetype?: string;

  @Prop({ required: false })
  filetype?: string; // 'pdf' or 'bib'
}

export const uploadedfileSchema = SchemaFactory.createForClass(uploadedfile);
