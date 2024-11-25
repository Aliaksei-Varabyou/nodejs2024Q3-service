import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/User/user.module';
import { JwtAuthGuard } from './jwt-auth.guard';

const secret_key = process.env.JWT_SECRET_KEY || 'secret_key';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: secret_key,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
