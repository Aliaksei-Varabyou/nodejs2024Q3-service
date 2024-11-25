import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './Auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './Auth/public.decorator';
@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: JwtAuthGuard,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;

    const openPaths = ['/auth/signup', '/auth/login', '/doc', '/'];

    if (openPaths.includes(path)) {
      return true;
    }

    return this.jwtAuthGuard.canActivate(context);
  }
}
