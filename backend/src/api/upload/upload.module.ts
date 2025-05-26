import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { uploadedfile, uploadedfileSchema } from './upload.schema';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

/**
 * Author: Andrew Koves
 * ID: 20126313
 *
 * Module configuration for the upload functionality.
 * Registers schemas, services, and controllers with NestJS.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: uploadedfile.name, schema: uploadedfileSchema },
    ]),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService], // Make service available to other modules
})
export class UploadModule {}
