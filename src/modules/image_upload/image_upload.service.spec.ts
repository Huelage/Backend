import { Test, TestingModule } from '@nestjs/testing';

import { ImageUploadService } from './image_upload.service';
import { FileUploadService } from '../../file_upload/file_upload.interface';
import { HuelagerRepository } from '../huelager/huelager.repository';
import { ProductRepository } from '../product/product.repository';
import { NotFoundException } from '@nestjs/common';

const mockFileUploadService = () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
});
const mockHuelagerRepository = () => ({
  findHuelager: jest.fn(),
  editHuelagerInfo: jest.fn(),
});
const mockProductRepository = () => ({
  findProduct: jest.fn(),
  editProductInfo: jest.fn(),
});

describe('ImageUploadService', () => {
  let service;
  let huelagerRepository;
  let fileUploadService;
  let productRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageUploadService,
        { provide: FileUploadService, useFactory: mockFileUploadService },
        { provide: HuelagerRepository, useFactory: mockHuelagerRepository },
        { provide: ProductRepository, useFactory: mockProductRepository },
      ],
    }).compile();

    service = await module.get<ImageUploadService>(ImageUploadService);
    huelagerRepository = await module.get<HuelagerRepository>(
      HuelagerRepository,
    );
    productRepository = await module.get<ProductRepository>(ProductRepository);
    fileUploadService = await module.get<FileUploadService>(FileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    // const uploadImage = async () => service.uploadImage;

    const mockFound = { imgUrl: 'mockUrl' };

    it('uploads the image to cloudinary and adds the link to the huelager got from the id', async () => {
      huelagerRepository.findHuelager.mockResolvedValue(mockFound);
      fileUploadService.uploadImage.mockResolvedValue('testUrl');
      huelagerRepository.editHuelagerInfo.mockResolvedValue({ affected: 1 });

      const result = await service.uploadImage({
        id: 'testId',
        type: 'entity',
        image: Promise.resolve({ uploadLocation: 'entity' }),
      });

      expect(huelagerRepository.findHuelager).toHaveBeenCalledWith({
        where: { entityId: 'testId' },
      });

      expect(fileUploadService.uploadImage).toHaveBeenCalledWith({
        uploadLocation: 'entity',
      });

      expect(huelagerRepository.editHuelagerInfo).toHaveBeenCalledWith({
        where: { entityId: 'testId' },
        update: { imgUrl: 'testUrl' },
      });

      expect(result).toStrictEqual('testUrl');
    });

    it('uploads the image to cloudinary and adds the link to the product got from the id', async () => {
      productRepository.findProduct.mockResolvedValue(mockFound);
      fileUploadService.uploadImage.mockResolvedValue('testUrl');
      productRepository.editProductInfo.mockResolvedValue({ affected: 1 });

      const result = await service.uploadImage({
        id: 'testId',
        type: 'product',
        image: Promise.resolve({ uploadLocation: 'product' }),
      });

      expect(productRepository.findProduct).toHaveBeenCalledWith({
        where: { productId: 'testId' },
      });

      expect(fileUploadService.uploadImage).toHaveBeenCalledWith({
        uploadLocation: 'product',
      });

      expect(productRepository.editProductInfo).toHaveBeenCalledWith({
        where: { productId: 'testId' },
        update: { imgUrl: 'testUrl' },
      });

      expect(result).toStrictEqual('testUrl');
    });

    it('throws a not found error if no huelager or product with the id exists', async () => {
      huelagerRepository.findHuelager.mockResolvedValue(null);

      const uploadImage = async () =>
        service.uploadImage({
          id: 'testId',
          type: 'entity',
          image: Promise.resolve({ uploadLocation: 'entity' }),
        });

      expect(uploadImage()).rejects.toThrow(NotFoundException);
    });

    it('throws a not found error if somehow the huelager or product is found but not edited', async () => {
      huelagerRepository.findHuelager.mockResolvedValue(mockFound);
      fileUploadService.uploadImage.mockResolvedValue('testUrl');
      huelagerRepository.editHuelagerInfo.mockResolvedValue({ affected: 0 });

      const uploadImage = async () =>
        service.uploadImage({
          id: 'testId',
          type: 'entity',
          image: Promise.resolve({ uploadLocation: 'entity' }),
        });

      expect(uploadImage()).rejects.toThrow(NotFoundException);
    });
  });
});
