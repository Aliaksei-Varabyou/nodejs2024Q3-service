import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/User/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.userService.findByLogin(login);
    const isValidPassword = await bcrypt.compare(pass, user.password);
    if (user && isValidPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private async generateTokens(payload) {
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }

  async login(user: any) {
    const payload = { login: user.login, userId: user.id };
    return await this.generateTokens(payload);
  }

  async signup(login: string, pass: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = await this.userService.create({
      login,
      password: hashedPassword,
    });
    return newUser;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const user = await this.userService.findByLogin(decoded.login);
      if (!user) {
        throw new ForbiddenException('User not found');
      }
      const payload = { login: decoded.login, userId: user.id };
      return await this.generateTokens(payload);
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
