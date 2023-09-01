import { HuelagerType } from 'src/common/enums/huelager-type.enum';

export interface JwtPayload {
  id: number;
  type: HuelagerType;
}
