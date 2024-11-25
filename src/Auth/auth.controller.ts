import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

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
    await this.authService.signup(body.login, body.password);
    return { statusCode: HttpStatus.CREATED, message: 'User created' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
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
  async refresh(@Body() body: any) {
    if (!body.refreshToken) {
      return { statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid token' };
    }
    // logic for review tokens
  }
}
