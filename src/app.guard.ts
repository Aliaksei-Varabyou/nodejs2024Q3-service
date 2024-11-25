import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './Auth/jwt-auth.guard';
import { Observable } from 'rxjs';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtAuthGuard: JwtAuthGuard,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;

    const openPaths = ['/auth/signup', '/auth/login', '/doc', '/'];

    if (openPaths.includes(path)) {
      return true;
    }

    return this.jwtAuthGuard.canActivate(context);
  }
}
