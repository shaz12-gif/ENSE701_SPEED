import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Author: Andrew Koves
 * ID: 20126313
 *
 * Schema definition for uploaded evidence files and metadata.
 * Supports both file uploads and evidence-only submissions.
 */
@Schema()
export class UploadedFile extends Document {
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

export const UploadedFileSchema = SchemaFactory.createForClass(UploadedFile);
