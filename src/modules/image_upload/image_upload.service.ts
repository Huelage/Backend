import { Injectable } from '@nestjs/common';
import { FileUploadService } from 'src/file_upload/file_upload.interface';
import { UploadImageDto, UploadLocation } from './dtos/upload_image.dto';

@Injectable()
export class ImageUploadService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  async uploadImage(uploadImageDto: UploadImageDto) {
    const file = await uploadImageDto.image;
    const url = await this.fileUploadService.uploadImage(file);

    if (file.uploadLocation === UploadLocation.ENTITY) {
      console.log(uploadImageDto.id);
    }
    return url;
  }
}
