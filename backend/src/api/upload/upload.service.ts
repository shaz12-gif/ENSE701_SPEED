import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadedFile } from './upload.schema';

//Andrew Koves
//20126313

@Injectable()
export class UploadService {
  // Injects the UploadedFile model for database operations
  constructor(
    @InjectModel(UploadedFile.name)
    private uploadedFileModel: Model<UploadedFile>,
  ) {}

  // Saves an uploaded file to the database
  async saveFile(file: Express.Multer.File): Promise<UploadedFile> {
    if (!file || !file.originalname || !file.buffer || !file.mimetype) {
      throw new Error('Invalid file upload');
    }

    let created: UploadedFile;
    // If the file is a .bib file, store its content as text
    if (file.originalname.endsWith('.bib')) {
      created = new this.uploadedFileModel({
        filename: file.originalname,
        textData: file.buffer.toString('utf-8'),
        mimetype: file.mimetype,
        filetype: 'bib',
      });
      // If the file is a PDF, store its content as binary data
    } else if (
      file.mimetype === 'application/pdf' ||
      file.originalname.endsWith('.pdf')
    ) {
      created = new this.uploadedFileModel({
        filename: file.originalname,
        data: file.buffer,
        mimetype: file.mimetype,
        filetype: 'pdf',
      });
    } else {
      throw new Error('Only PDF and .bib files are allowed');
    }
    return await created.save();
  }

  // Finds an uploaded file by its MongoDB ID
  async findFileById(id: string) {
    return this.uploadedFileModel.findById(id).exec();
  }
}
