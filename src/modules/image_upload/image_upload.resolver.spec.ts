import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadResolver } from './image_upload.resolver';
import { ImageUploadService } from './image_upload.service';

const mockImageUploadService = () => ({});

describe('ImageUploadResolver', () => {
  let resolver: ImageUploadResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageUploadResolver,
        { provide: ImageUploadService, useFactory: mockImageUploadService },
      ],
    }).compile();

    resolver = module.get<ImageUploadResolver>(ImageUploadResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
