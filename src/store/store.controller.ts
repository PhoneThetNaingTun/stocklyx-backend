import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators';
import { RoleGuard } from 'src/auth/guards';
import { GetCompanyId } from 'src/comm/decorators';
import { StoreDeleteManyDto } from './dto';
import { StoreDto } from './dto/store.dto';
import { StoreService } from './store.service';

@Controller('store')
@Roles(Role.OWNER)
@UseGuards(RoleGuard)
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Get('all')
  getAll(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('store_name') store_name: string,
  ) {
    return this.storeService.findAll(companyId, page, limit, store_name);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createStore(@GetCompanyId() companyId: string, @Body() dto: StoreDto) {
    return this.storeService.createOne(companyId, dto);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  updateStore(@Param('id') storeId: string, @Body() dto: StoreDto) {
    return this.storeService.updateOne(storeId, dto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  deleteStore(@Param('id') storeId: string) {
    return this.storeService.deleteOne(storeId);
  }

  @Delete('delete-multiple')
  @HttpCode(HttpStatus.OK)
  deleteManyStore(@Body() dto: StoreDeleteManyDto) {
    return this.storeService.deleteMany(dto);
  }
}
