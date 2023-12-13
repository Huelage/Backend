import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlArgumentsHost.create(context);

    const { req } = ctx.getContext();
    const { connectionParams } = req;

    if (connectionParams) {
      const { Authorization, authorization } = connectionParams;
      if (Authorization || authorization) {
        // console.log(req.headers);

        req.headers = { authorization: authorization || Authorization };
      }
    }
    return req;
  }
}
