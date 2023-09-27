import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadService } from './image_upload.service';
import { FileUploadService } from 'src/file_upload/file_upload.interface';
import { HuelagerRepository } from '../huelager/huelager.repository';
import { ProductRepository } from '../product/product.repository';

const mockFileUploadService = () => ({});
const mockHuelagerRepository = () => ({});
const mockProductRepository = () => ({});

describe('ImageUploadService', () => {
  let service: ImageUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageUploadService,
        { provide: FileUploadService, useFactory: mockFileUploadService },
        { provide: HuelagerRepository, useFactory: mockHuelagerRepository },
        { provide: ProductRepository, useFactory: mockProductRepository },
      ],
    }).compile();

    service = module.get<ImageUploadService>(ImageUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
