import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { File } from '../../../common/interfaces/file.interface';
import { MinLength } from 'class-validator';

export enum UploadLocation {
  ENTITY = 'entity',
  PRODUCT = 'product',
}

registerEnumType(UploadLocation, { name: 'UploadLocation' });

@InputType('UploadImageInput')
export class UploadImageDto {
  @MinLength(3)
  @Field()
  id: string;

  @Field(() => UploadLocation)
  type: UploadLocation;

  @Field(() => GraphQLUpload)
  image: Promise<File>;
}
