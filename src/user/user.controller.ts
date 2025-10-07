import { Controller, Get } from '@nestjs/common';
import { type User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
