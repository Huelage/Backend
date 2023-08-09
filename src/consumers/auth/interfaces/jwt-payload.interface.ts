import { ConsumerType } from 'src/common/enums/consumer-type.enum';

export interface JwtPayload {
  id: number;
  type: ConsumerType;
}
