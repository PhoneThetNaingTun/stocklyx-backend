import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import { GetUser, Public } from './decorators';
import { LoginDto, SignupDto } from './dto';
import { RefreshJwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signup(signupDto, res);
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshJwtAuthGuard)
  refresh(
    @GetUser()
    user: { refreshToken: string; sub: string; email: string; role: Role },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(user.sub, user.refreshToken, res);
  }
}
