import { Injectable } from '@nestjs/common';
import { File } from '../../common/interfaces/file.interface';
import { FileUploadService } from 'src/file_upload/file_upload.interface';

@Injectable()
export class ImageUploadService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  async uploadImage(file: File) {
    const url = await this.fileUploadService.uploadImage(file);
    return url;
  }
}
