import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as argon from 'argon2';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) throw new NotFoundException('Email not found!');

    const isMatch = await argon.verify(user.password, loginDto.password);
    if (!isMatch) throw new UnauthorizedException('Password not match!');

    const tokens = await this.createToken(user.id, user.email);
    const hashRefreshToken = await argon.hash(tokens.refreshToken);

    const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.token.upsert({
      where: { userId: user.id },
      update: { token: hashRefreshToken, expireAt },
      create: { userId: user.id, token: hashRefreshToken, expireAt },
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }

  async signup(signupDto: SignupDto, res: Response) {
    const isExist = await this.prisma.user.findUnique({
      where: { email: signupDto.user.email },
    });
    if (isExist) throw new ConflictException('Email already exist!');

    const hashPassword = await argon.hash(signupDto.user.password);
    const newUser = await this.prisma.user.create({
      data: {
        name: signupDto.user.name,
        email: signupDto.user.email,
        password: hashPassword,
        role: Role.OWNER,
      },
    });

    await this.prisma.company.create({
      data: {
        company_name: signupDto.company.company_name,
        ownerId: newUser.id,
      },
    });

    const tokens = await this.createToken(newUser.id, newUser.email);
    const hashRefreshToken = await argon.hash(tokens.refreshToken);

    const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.token.create({
      data: {
        userId: newUser.id,
        token: hashRefreshToken,
        expireAt,
      },
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }

  async refreshToken(userId: string, refreshToken: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const token = await this.prisma.token.findUnique({ where: { userId } });
    if (!token) throw new NotFoundException('Token not found');

    const isMatch = await argon.verify(token.token, refreshToken);
    if (!isMatch) throw new UnauthorizedException('Token not match');

    if (token.expireAt < new Date())
      throw new UnauthorizedException('Token expired');

    const tokens = await this.createToken(user.id, user.email);
    const hashRefreshToken = await argon.hash(tokens.refreshToken);
    const tokenExpireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.token.update({
      where: { userId: user.id },
      data: { token: hashRefreshToken, expireAt: tokenExpireAt },
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }

  async createToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.configService.get('ACCESS_JWT_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, email },
      {
        secret: this.configService.get('REFRESH_JWT_SECRET'),
        expiresIn: '7d',
      },
    );
    return { accessToken, refreshToken };
  }
}
