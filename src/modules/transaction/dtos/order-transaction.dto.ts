import { Wallet } from '../../../modules/huelager/entities/huenit_wallet.entity';
import {
  Order,
  PaymentMethod,
} from '../../../modules/order/entities/order.entity';

export class OrderTransactionDto {
  vendorId: string;

  userId: string;

  huenitAmount: number;

  cardAmount: number;

  totalAmount: number;

  paymentMethod: PaymentMethod;

  pgTransactionId: string;

  order: Order;

  senderWallet: Wallet;

  receiverWallet: Wallet;
}
