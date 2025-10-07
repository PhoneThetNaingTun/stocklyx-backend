import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenJwtStrategy, RefreshTokenJwtStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenJwtStrategy, RefreshTokenJwtStrategy],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
