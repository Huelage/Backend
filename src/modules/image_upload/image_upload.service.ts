import { HttpException, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { FileUploadService } from '../../file_upload/file_upload.interface';
import { UploadImageInput, UploadLocation } from './dtos/upload_image.dto';
import { HuelagerRepository } from '../huelager/huelager.repository';
import { Huelager } from '../huelager/entities/huelager.entity';
import { Product } from '../product/entities/product.entity';
import { ProductRepository } from '../product/product.repository';

@Injectable()
export class ImageUploadService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly huelagerRepository: HuelagerRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async uploadImage(uploadImageInput: UploadImageInput) {
    const file = await uploadImageInput.image;
    const id = uploadImageInput.id;

    let result: UpdateResult;
    let toEdit: Huelager | Product;

    if (file.uploadLocation === UploadLocation.ENTITY) {
      toEdit = await this.huelagerRepository.findHuelagerById(id);
    } else {
      toEdit = await this.productRepository.findProductById(id);
    }

    if (!toEdit) throw new HttpException('id is invalid', 422);

    const previousUrl = toEdit?.imgUrl;

    const imgUrl = await this.fileUploadService.uploadImage(file);

    if (file.uploadLocation === UploadLocation.ENTITY) {
      result = await this.huelagerRepository.editHuelagerInfo({
        where: { entityId: id },
        update: { imgUrl },
      });
    } else {
      result = await this.productRepository.editProductInfo({
        where: { productId: id },
        update: { imgUrl },
      });
    }

    if (result.affected === 0) {
      throw new HttpException('id is invalid', 422);
    } else {
      if (previousUrl) {
        const publicId = previousUrl
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0];
        this.fileUploadService.deleteImage(publicId);
      }
    }

    return imgUrl;
  }
}
