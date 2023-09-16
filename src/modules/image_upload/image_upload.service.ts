import { HttpException, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { FileUploadService } from 'src/file_upload/file_upload.interface';
import { UploadImageDto, UploadLocation } from './dtos/upload_image.dto';
import { HuelagerRepository } from '../huelager/huelager.repository';

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

    const imgUrl = await this.fileUploadService.uploadImage(file);
    // const imgUrl =
    //   'https://res.cloudinary.com/dtgigdp2j/image/upload/v1690997901/profileImages/ovgly1p1go37dp1b2jzp.jpg';

    if (file.uploadLocation === UploadLocation.ENTITY) {
      result = await this.huelagerRepository.editHuelagerInfo({
        where: { entityId: id },
        update: { imgUrl },
      });
    } else {
      result = { generatedMaps: [], raw: [], affected: 0 };
    }

    if (result.affected === 0) throw new HttpException('id is invalid', 422);

    return imgUrl;
  }
}
