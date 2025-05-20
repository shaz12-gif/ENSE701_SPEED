import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//Andrew Koves
//20126313

// Defines the schema for uploaded files (PDFs and .bib files)
// This schema is used to store both PDF and .bib files in the database
@Schema()
export class UploadedFile extends Document {
  // The filename of the uploaded file (e.g., "document.pdf" or "references.bib")
  @Prop()
  filename: string;

  // Store binary data for PDFs (will be undefined for .bib files)
  @Prop({ type: Buffer, required: false })
  data: Buffer;

  // Store text data for .bib files (will be undefined for PDFs)
  @Prop({ required: false })
  textData: string;

  // The MIME type of the file (e.g., "application/pdf" or "text/plain")
  @Prop()
  mimetype: string;

  // Indicates the file type: 'pdf' for PDF files, 'bib' for .bib files
  @Prop()
  filetype: string; // 'pdf' or 'bib'
}

// Creates the Mongoose schema for the UploadedFile class
export const UploadedFileSchema = SchemaFactory.createForClass(UploadedFile);
