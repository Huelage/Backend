import { Injectable } from '@nestjs/common';

import { FileUploadService } from '../../file_upload/file_upload.interface';
import { UploadImageInput } from './dtos/upload_image.dto';

@Injectable()
export class ImageUploadService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  async uploadImage(uploadImageInput: UploadImageInput) {
    const file = await uploadImageInput.image;

    const imgUrl = this.fileUploadService.uploadImage(file);

    return imgUrl;
  }
}

// 'previousUrl'.split('/').slice(-2).join('/').split('.')[0];
