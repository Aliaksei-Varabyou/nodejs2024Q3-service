import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    if (
      !body.login ||
      !body.password ||
      typeof body.login !== 'string' ||
      typeof body.password !== 'string'
    ) {
      return { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid data' };
    }
    return await this.authService.signup(body.login, body.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.login, body.password);
    if (!user) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Authentication failed',
      };
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: any) {
    try {
      return await this.authService.refresh(body.refreshToken);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException();
      }
      throw error;
    }
  }
}
