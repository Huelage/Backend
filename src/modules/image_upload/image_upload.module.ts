import { Module } from '@nestjs/common';
import { ImageUploadService } from './image_upload.service';
import { ImageUploadResolver } from './image_upload.resolver';
import { FileUploadModule } from '../../file_upload/file_upload.module';
import { HuelagersModule } from '../huelager/huelagers.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [FileUploadModule, HuelagersModule, ProductModule],
  providers: [ImageUploadResolver, ImageUploadService],
})
export class ImageUploadModule {}
