import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: (req) => {
        return req?.cookies?.refresh_token;
      },
      secretOrKey: configService.get('REFRESH_JWT_SECRET')!,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { sub: string; email: string; role: Role },
  ) {
    const { sub, email } = payload;
    const user = await this.prisma.user.findUnique({
      where: { id: sub, email },
    });
    if (!user) throw new Error('User not found!');
    const refreshToken = req.cookies.refresh_token;

    return { refreshToken, ...payload };
  }
}
