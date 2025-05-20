import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadedFile, UploadedFileSchema } from './upload.schema';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

//Andrew Koves
//20126313

//Defines the schema for the PDF document and groups everything for NestJS
@Module({
  imports: [
    // Registers the UploadedFile schema with Mongoose
    MongooseModule.forFeature([
      { name: UploadedFile.name, schema: UploadedFileSchema },
    ]),
  ],
  providers: [UploadService], // Makes the service available for dependency injection
  controllers: [UploadController], // Registers the controller for handling HTTP requests
})
export class UploadModule {}
