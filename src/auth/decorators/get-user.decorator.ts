import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, cxt: ExecutionContext) => {
    const request = cxt.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
