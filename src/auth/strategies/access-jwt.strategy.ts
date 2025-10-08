import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESS_JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const { sub, email } = payload;
    const user = await this.prisma.user.findUnique({
      where: { id: sub, email },
      include: { Company: true },
    });
    if (!user) throw new Error('User not found!');
    const companyId = user.Company.length > 0 ? user.Company[0].id : null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId,
    };
  }
}
