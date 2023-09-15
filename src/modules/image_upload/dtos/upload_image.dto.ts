import { Field, InputType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { File } from '../../../common/interfaces/file.interface';

@InputType('UploadImageInput')
export class UploadImageDto {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  breed: string;

  @Field(() => GraphQLUpload)
  image: Promise<File>;
}
