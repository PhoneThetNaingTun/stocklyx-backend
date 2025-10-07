import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Role_Key } from '../decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(Role_Key, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!roles.includes(user.role)) return false;

    return true;
  }
}
