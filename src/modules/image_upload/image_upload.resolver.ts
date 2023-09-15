import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ImageUploadService } from './image_upload.service';
import { UploadImageDto } from './dtos/upload_image.dto';
import { FileValidationPipe } from 'src/pipes/file-validation.pipe';

@Resolver()
export class ImageUploadResolver {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Mutation(() => Boolean)
  async uploadImage(
    @Args('input', FileValidationPipe) uploadImageDto: UploadImageDto,
  ) {
    console.log(await uploadImageDto);

    return true;
    // await this.catsService.create(createCatDto)
  }
}
