import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createStaff(dto: CreateStaffDto) {}
}
