import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Param,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './upload.service';

//Andrew Koves
//20126313

// Controller for handling HTTP requests for file uploads and retrieval
@Controller('upload')
export class UploadController {
  // Injects the UploadService for business logic
  constructor(private readonly uploadService: UploadService) {}

  // Handles file upload requests (POST /upload)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const saved = await this.uploadService.saveFile(file);
      return { success: true, data: saved };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { success: false, message: error.message };
    }
  }

  // Handles file retrieval requests by ID (GET /upload/:id)
  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const fileDoc = await this.uploadService.findFileById(id);
    if (!fileDoc) {
      throw new NotFoundException('File not found');
    }
    res.set({
      'Content-Type': fileDoc.mimetype,
      'Content-Disposition': `inline; filename="${fileDoc.filename}"`,
    });
    // If the file is a .bib, send the text data; otherwise, send the binary data
    if (fileDoc.filetype === 'bib') {
      res.send(fileDoc.textData);
    } else {
      res.send(fileDoc.data);
    }
  }

  // Handles errors and returns a standardized error response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleError(error: any) {
    return { success: false, message: 'Some error message' };
  }
}
