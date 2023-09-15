import { ReadStream } from 'fs';

export const validateFileFormat = (
  filename: string,
  allowedFileFormats: string[],
) => {
  const filePath = filename.split('.');
  const extension = filePath[filePath.length - 1];

  return allowedFileFormats.includes(extension);
};

export const validateFileSize = async (
  fileStream: ReadStream,
  allowedFileSizeInBytes,
) => {
  return new Promise((resolve, reject) => {
    let fileSizeInBytes = 0;

    fileStream
      .on('data', (data: Buffer) => {
        fileSizeInBytes += data.byteLength;
      })
      .on('end', () => {
        resolve(fileSizeInBytes <= allowedFileSizeInBytes);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};
