import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { getBuffer, validateFileFormat } from '../common/utils/file.util';
import { UploadImageDto } from '../modules/image_upload/dtos/upload_image.dto';
import { ReadStream } from 'fs';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  async transform(uploadImageDto: UploadImageDto, metadata: ArgumentMetadata) {
    const image = await uploadImageDto.image;

    if (!image.filename) throw new Error('File not provided');

    const { filename, createReadStream } = image;
    const fileStream = createReadStream() as ReadStream;

    const isFileFormatValid = validateFileFormat(filename, [
      'jpg',
      'png',
      'jpeg',
    ]);

    if (!isFileFormatValid) throw new Error('File not valid');
    const buffer = await getBuffer(fileStream);

    (await uploadImageDto.image).buffer = buffer;
    (await uploadImageDto.image).uploadLocation = uploadImageDto.type;
    return uploadImageDto;
  }
}
