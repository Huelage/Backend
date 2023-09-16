import { HttpException, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { FileUploadService } from 'src/file_upload/file_upload.interface';
import { UploadImageDto, UploadLocation } from './dtos/upload_image.dto';
import { HuelagerRepository } from '../huelager/huelager.repository';
import { Huelager } from '../huelager/entities/huelager.entity';
import { Product } from '../huelager/other_entities/product.entity';

@Injectable()
export class ImageUploadService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly huelagerRepository: HuelagerRepository,
  ) {}

  async uploadImage(uploadImageDto: UploadImageDto) {
    const file = await uploadImageDto.image;
    const id = uploadImageDto.id;

    let result: UpdateResult;
    let toEdit: Huelager | Product;

    if (file.uploadLocation === UploadLocation.ENTITY) {
      toEdit = await this.huelagerRepository.findHuelagerById(id);
    } else {
      toEdit = null;
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
      result = { generatedMaps: [], raw: [], affected: 0 };
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
