import { Module } from '@nestjs/common';
import { ImageUploadService } from './image_upload.service';
import { ImageUploadResolver } from './image_upload.resolver';

@Module({
  providers: [ImageUploadResolver, ImageUploadService],
})
export class ImageUploadModule {}
