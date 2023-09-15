import { File } from '../common/interfaces/file.interface';

export abstract class FileUploadService {
  abstract uploadImage(file: File): Promise<string>;
  abstract uploadImages(files: File[]): Promise<string[]>;
}
