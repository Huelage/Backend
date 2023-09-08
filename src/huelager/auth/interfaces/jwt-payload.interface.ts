import { HuelagerType } from '../../entities/huelager.entity';

export interface JwtPayload {
  id: number;
  type: HuelagerType;
}
