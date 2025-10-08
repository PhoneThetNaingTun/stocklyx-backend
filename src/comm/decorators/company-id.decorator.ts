import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCompanyId = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return req.user?.companyId;
  },
);
