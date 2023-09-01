import { ConsumerType } from 'src/common/enums/consumer-type.enum';

export class RefreshTokenDto {
  id: number;
  type: ConsumerType;
  refreshToken: string;
}
