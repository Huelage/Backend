import { HuelagerType } from '../../entities/huelager.entity';

export interface JwtPayload {
  entityId: string;
  type: HuelagerType;
}
