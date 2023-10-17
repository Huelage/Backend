import { Huelager } from '../../modules/huelager/entities/huelager.entity';

export interface AccessTokenRequest {
  user: Huelager;
}

export interface RefreshTokenRequest {
  user: {
    refreshToken: string;
    entityId: string;
    iat: number;
    exp: number;
  };
}
