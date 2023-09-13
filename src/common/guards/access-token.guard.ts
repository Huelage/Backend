import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlArgumentsHost.create(context);

    return ctx.getContext().req;
  }
}
