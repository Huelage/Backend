import { Test, TestingModule } from '@nestjs/testing';

import { ImageUploadService } from './image_upload.service';
import { FileUploadService } from '../../file_upload/file_upload.interface';

const mockFileUploadService = () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
});

describe('ImageUploadService', () => {
  let service;
  let fileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageUploadService,
        { provide: FileUploadService, useFactory: mockFileUploadService },
      ],
    }).compile();

    service = await module.get<ImageUploadService>(ImageUploadService);

    fileUploadService = await module.get<FileUploadService>(FileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('uploads the image to cloudinary and adds the link to the huelager got from the id', async () => {
      fileUploadService.uploadImage.mockResolvedValue('testUrl');

      const result = await service.uploadImage({
        id: 'testId',
        type: 'entity',
        image: Promise.resolve({ filename: 'testFileName' }),
      });

      expect(fileUploadService.uploadImage).toHaveBeenCalledTimes(1);
      expect(fileUploadService.uploadImage).toHaveBeenCalledWith({
        filename: 'testFileName',
      });

      expect(result).toStrictEqual('testUrl');
    });
  });
});
