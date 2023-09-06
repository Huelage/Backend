import { HuelagerType } from '../../common/enums/huelager-type.enum';

export class RefreshTokenDto {
  id: number;
  type: HuelagerType;
  refreshToken: string;
}
