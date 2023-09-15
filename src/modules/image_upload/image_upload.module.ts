import { Module } from '@nestjs/common';
import { ImageUploadService } from './image_upload.service';
import { ImageUploadResolver } from './image_upload.resolver';
import { FileUploadModule } from '../../file_upload/file_upload.module';

@Module({
  imports: [FileUploadModule],
  providers: [ImageUploadResolver, ImageUploadService],
})
export class ImageUploadModule {}
