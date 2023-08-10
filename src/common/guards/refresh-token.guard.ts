import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlArgumentsHost.create(context);

    return ctx.getContext().req;
  }
}
