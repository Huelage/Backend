import { HuelagerType } from '../../../common/enums/huelager-type.enum';

export interface JwtPayload {
  id: number;
  type: HuelagerType;
}
