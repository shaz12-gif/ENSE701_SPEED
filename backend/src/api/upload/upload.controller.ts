import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Param,
  Get,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './upload.service';

interface EvidenceData {
  practiceId: string;
  claimId: string;
  supportsClaim: boolean;
  title: string;
  source: string;
  year: number;
  description?: string;
}

interface UploadResponse {
  success: boolean;
  data?: any;
  message?: string;
}

/**
 * Author: Andrew Koves
 * ID: 20126313
 *
 * Controller for handling HTTP requests for evidence uploads and retrieval.
 * Supports both file uploads and evidence-only submissions.
 */
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Handles evidence submission requests with optional file upload
   * Checks the fields
   * calls app.service.saveFile to save the evidence data
   * returns a sucess or error message
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() evidenceData: Partial<EvidenceData>,
  ): Promise<UploadResponse> {
    try {
      // Always required fields
      if (!evidenceData.practiceId || !evidenceData.claimId) {
        throw new Error('Practice and claim are required');
      }

      // Parse boolean from string if needed
      const parsedData: EvidenceData = {
        practiceId: String(evidenceData.practiceId),
        claimId: String(evidenceData.claimId),
        supportsClaim: String(evidenceData.supportsClaim) === 'true',
        // If just a fule is uploaded these are optional
        title: evidenceData.title || '',
        source: evidenceData.source || '',
        year: evidenceData.year
          ? Number(evidenceData.year)
          : new Date().getFullYear(),
        description: evidenceData.description || '',
      };

      const saved = await this.uploadService.saveFile(file || null, parsedData);
      return { success: true, data: saved };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to upload evidence',
      };
    }
  }

  /**
   * Retrieves a previously uploaded file by ID
   * Dont need this yet, but will be used to display evidence
   */
  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const fileDoc = await this.uploadService.findFileById(id);
    if (!fileDoc) {
      throw new NotFoundException('File not found');
    }

    // Only set headers if theres actual file data
    if (fileDoc.filename && (fileDoc.data || fileDoc.textData)) {
      res.set({
        'Content-Type': fileDoc.mimetype,
        'Content-Disposition': `inline; filename="${fileDoc.filename}"`,
      });

      // Send appropriate data based on file type
      if (fileDoc.filetype === 'bib' && fileDoc.textData) {
        res.send(fileDoc.textData);
      } else if (fileDoc.data) {
        res.send(fileDoc.data);
      } else {
        throw new NotFoundException('File content not found');
      }
    } else {
      // Return just the evidence data if no file was uploaded
      res.json({
        id: fileDoc._id,
        practiceId: fileDoc.practiceId,
        claimId: fileDoc.claimId,
        supportsClaim: fileDoc.supportsClaim,
        title: fileDoc.title,
        source: fileDoc.source,
        year: fileDoc.year,
        description: fileDoc.description,
      });
    }
  }

  @Get('practice/:id')
  async getEvidenceByPractice(@Param('id') practiceId: string) {
    try {
      const evidence = await this.uploadService.findByPracticeId(practiceId);
      return evidence;
    } catch (error) {
      console.error('Failed to fetch evidence:', error);
      throw new NotFoundException('Evidence not found for this practice');
    }
  }
}
