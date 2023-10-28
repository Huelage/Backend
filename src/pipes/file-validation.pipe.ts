import { Injectable, PipeTransform } from '@nestjs/common';

import { validateFileFormat } from '../common/utils/file.util';
import { UploadImageInput } from '../modules/image_upload/dtos/upload_image.dto';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  async transform(uploadImageInput: UploadImageInput) {
    const image = await uploadImageInput.image;

    if (!image.filename) throw new Error('File not provided');

    const { filename } = image;

    const isFileFormatValid = validateFileFormat(filename, [
      'jpg',
      'png',
      'jpeg',
    ]);

    if (!isFileFormatValid) throw new Error('File not valid');

    return uploadImageInput;
  }
}
