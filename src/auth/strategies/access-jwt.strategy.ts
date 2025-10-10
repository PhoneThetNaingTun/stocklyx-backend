import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      include: { Company: true, shops: true },
    });
    if (!user) throw new Error('User not found!');
    if (user.Company.length > 0) {
      const companyId = user.Company[0].id;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId,
      };
    }

    if (user.shops.length > 0) {
      const shopId = user.shops[0].id;
      const companyId = user.shops[0].companyId;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId,
        shopId,
      };
    }

    return new UnauthorizedException([
      "You don't belong to any company or shop",
    ]);
  }
}
