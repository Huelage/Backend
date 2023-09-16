import { Module } from '@nestjs/common';
import { ImageUploadService } from './image_upload.service';
import { ImageUploadResolver } from './image_upload.resolver';
import { FileUploadModule } from '../../file_upload/file_upload.module';
import { HuelagersModule } from '../huelager/huelagers.module';

@Module({
  imports: [FileUploadModule, HuelagersModule],
  providers: [ImageUploadResolver, ImageUploadService],
})
export class ImageUploadModule {}
