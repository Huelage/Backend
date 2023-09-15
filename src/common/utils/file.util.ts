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

export const getBuffer = async (
  fileStream: ReadStream,
): Promise<ArrayBufferLike> => {
  return new Promise((resolve, reject) => {
    let buffer: ArrayBufferLike;

    fileStream
      .on('data', (data: Buffer) => {
        buffer = data.buffer;
      })
      .on('end', () => {
        resolve(buffer);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};
