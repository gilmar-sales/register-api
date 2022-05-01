import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import Role from 'src/@types/Role';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.entity';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      ctx.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = ctx.getContext().req;
    const user: User = request.user;

    return requiredRoles.some((role) => user.role === role);
  }
}
