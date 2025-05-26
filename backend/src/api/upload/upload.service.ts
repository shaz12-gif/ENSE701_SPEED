import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { uploadedfile } from './upload.schema';

interface EvidenceData {
  practiceId: string;
  claimId: string;
  supportsClaim: boolean;
  title?: string;
  source?: string;
  year: number;
  description?: string;
}

/**
 * Author: Andrew Koves
 * ID: 20126313
 *
 * Service for handling file uploads and retrievals.
 * Supports PDF and BibTeX (.bib) file formats.
 */
@Injectable()
export class UploadService {
  /**
   * Constructor - Injects the uploadedfile model for database operations
   * @param uploadedfileModel - Mongoose model for uploaded files
   */
  constructor(
    @InjectModel(uploadedfile.name)
    private uploadedfileModel: Model<uploadedfile>,
  ) {}

  /**
   * Saves an uploaded file to the database
   * checks if the required fields are present
   * if a file is uploaded the title/source/year are optional
   * if no file is uploaded title/source/year are required
   */
  async saveFile(
    file: Express.Multer.File | null,
    parsedData: EvidenceData,
  ): Promise<uploadedfile> {
    // Always validate required fields
    if (!parsedData.practiceId || !parsedData.claimId) {
      throw new BadRequestException('Practice and claim are required');
    }

    let created: uploadedfile;

    try {
      // Base evidence data
      const evidenceData = {
        practiceId: String(parsedData.practiceId),
        claimId: String(parsedData.claimId),
        supportsClaim: Boolean(parsedData.supportsClaim),
      };

      if (file) {
        // With file upload other fields are optional
        created = new this.uploadedfileModel({
          ...evidenceData,
          title: parsedData.title || '',
          source: parsedData.source || '',
          year: parsedData.year || null,
          description: parsedData.description || '',
          filename: file.originalname,
          mimetype: file.mimetype,
          filetype: file.originalname.endsWith('.bib') ? 'bib' : 'pdf',
          ...(file.originalname.endsWith('.bib')
            ? { textData: file.buffer.toString('utf-8') }
            : { data: file.buffer }),
        });
      } else {
        // Without file validate required fields
        if (!parsedData.title || !parsedData.source || !parsedData.year) {
          throw new BadRequestException(
            'Title, source, and year are required when no file is uploaded',
          );
        }

        created = new this.uploadedfileModel({
          ...evidenceData,
          title: parsedData.title,
          source: parsedData.source,
          year: Number(parsedData.year),
          description: parsedData.description || '',
        });
      }

      return await created.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        'Failed to save evidence: ' + error.message,
      );
    }
  }

  /**
   * Retrieves a file by its ID from the database
   */
  async findFileById(id: string): Promise<uploadedfile | null> {
    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.uploadedfileModel.findById(id).exec();
  }
}
