import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { FileUploadService } from './file_upload.interface';

@Module({
  providers: [
    { provide: FileUploadService, useClass: CloudinaryService },
    CloudinaryProvider,
  ],
  exports: [FileUploadService, CloudinaryProvider],
})
export class FileUploadModule {}
