import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadResolver } from './image_upload.resolver';
import { ImageUploadService } from './image_upload.service';

const mockImageUploadService = () => ({
  uploadImage: jest.fn(),
});

describe('ImageUploadResolver', () => {
  let resolver;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageUploadResolver,
        { provide: ImageUploadService, useFactory: mockImageUploadService },
      ],
    }).compile();

    resolver = module.get<ImageUploadResolver>(ImageUploadResolver);
    service = module.get<ImageUploadService>(ImageUploadService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('uploadImage', () => {
    const mockUploadInput = {
      id: 'testId',
      type: 'testType',
      image: 'testImage',
    };
    const uploadImage = async () => resolver.uploadImage(mockUploadInput);
    it('calls the uploadImage service and returns the image url', async () => {
      service.uploadImage.mockResolvedValue('testUrl');

      const result = await uploadImage();

      expect(service.uploadImage).toHaveBeenCalledWith(mockUploadInput);
      expect(result).toEqual('testUrl');
    });
  });
});
