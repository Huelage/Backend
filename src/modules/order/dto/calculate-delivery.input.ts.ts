import { InputType, Field } from '@nestjs/graphql';
import { AddressInterface } from 'src/modules/huelager/dtos/create-account.input';

@InputType()
export class CalculateDeliveryInput {
  @Field()
  vendorAddress: AddressInterface;

  @Field()
  deliveryAddress: AddressInterface;
}
