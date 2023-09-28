import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadResolver } from './image_upload.resolver';
import { ImageUploadService } from './image_upload.service';
import { DeepMocked } from '@golevelup/ts-jest';
import { UploadImageInput } from './dtos/upload_image.dto';

const mockImageUploadService = () => ({
  uploadImage: jest.fn(),
});

describe('ImageUploadResolver', () => {
  let resolver: ImageUploadResolver;
  let service: DeepMocked<ImageUploadService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageUploadResolver,
        { provide: ImageUploadService, useFactory: mockImageUploadService },
      ],
    }).compile();

    resolver = module.get<ImageUploadResolver>(ImageUploadResolver);
    service = module.get(ImageUploadService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('uploadImage', () => {
    const uploadImageInput = new UploadImageInput();
    const uploadImage = async () => resolver.uploadImage(uploadImageInput);
    it('calls the uploadImage service and returns the image url', async () => {
      service.uploadImage.mockResolvedValue('testUrl');

      const result = await uploadImage();

      expect(service.uploadImage).toHaveBeenCalledWith(uploadImageInput);
      expect(result).toEqual('testUrl');
    });
  });
});
