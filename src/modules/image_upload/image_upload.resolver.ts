import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ImageUploadService } from './image_upload.service';
import { UploadImageInput } from './dtos/upload_image.dto';
import { FileValidationPipe } from '../../pipes/file-validation.pipe';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';

@Resolver()
export class ImageUploadResolver {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @UseGuards(AccessTokenGuard)
  @Mutation(() => String)
  async uploadImage(
    @Args('input', FileValidationPipe) uploadImageInput: UploadImageInput,
  ) {
    return await this.imageUploadService.uploadImage(uploadImageInput);
  }
}
