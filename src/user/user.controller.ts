import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role, type User } from '@prisma/client';
import { GetUser, Roles } from 'src/auth/decorators';
import { RoleGuard } from 'src/auth/guards';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Post('create-staff')
  @Roles(Role.OWNER, Role.MANAGER)
  @UseGuards(RoleGuard)
  createStaff(@Body() dto: CreateStaffDto) {
    return this.userService.createStaff(dto);
  }
}
