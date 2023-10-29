import { Field, InputType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { File } from '../../../common/interfaces/file.interface';

@InputType('UploadImageInput')
export class UploadImageInput {
  @Field()
  id: string;

  @Field(() => GraphQLUpload)
  image: Promise<File>;
}
