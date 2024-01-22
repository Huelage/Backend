import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { AddressInterface } from 'src/modules/huelager/dtos/create-account.input';

@InputType()
export class CalculateDeliveryInput {
  @Field(() => GraphQLJSON)
  vendorAddress: AddressInterface;

  @Field(() => GraphQLJSON)
  deliveryAddress: AddressInterface;
}
