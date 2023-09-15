import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImageUploadService } from './image_upload.service';
import { UploadImageDto } from './dtos/upload_image.dto';
import { FileValidationPipe } from 'src/pipes/file-validation.pipe';

@Resolver()
export class ImageUploadResolver {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Query(() => String)
  sayHi(): string {
    return 'Hi World!';
  }

  @Mutation(() => String)
  async uploadImage(
    @Args('input', FileValidationPipe) uploadImageDto: UploadImageDto,
  ) {
    const { image } = uploadImageDto;
    return await this.imageUploadService.uploadImage(await image);
  }
}
