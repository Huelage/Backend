import { UploadLocation } from '../../modules/image_upload/dtos/upload_image.dto';
import { Stream } from 'stream';

export interface File {
  filename: string;

  mimetype: string;

  encoding: string;

  createReadStream: () => Stream;

  uploadLocation: UploadLocation;
}
