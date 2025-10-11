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
import { PublicRole, Roles } from 'src/auth/decorators';
import { RoleGuard } from 'src/auth/guards';
import { GetCompanyId } from 'src/comm/decorators';
import { MeasurementUnitDeleteManyDto, MeasurementUnitDto } from './dto';
import { MeasurementUnitService } from './measurement-unit.service';

@Roles(Role.OWNER, Role.MANAGER)
@UseGuards(RoleGuard)
@Controller('measurement-unit')
export class MeasurementUnitController {
  constructor(private measurementUnitService: MeasurementUnitService) {}

  @Get('all')
  @PublicRole()
  getAll(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('unit') unit: string,
  ) {
    return this.measurementUnitService.getAll(companyId, page, limit, unit);
  }
  @Get('all/archived')
  @PublicRole()
  getAllArchive(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('unit') unit: string,
  ) {
    return this.measurementUnitService.getAllArchives(
      companyId,
      page,
      limit,
      unit,
    );
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createOne(
    @GetCompanyId() companyId: string,
    @Body() dto: MeasurementUnitDto,
  ) {
    return this.measurementUnitService.createOne(companyId, dto);
  }

  @Patch('update/:id')
  async updateOne(
    @Param('id') measurementUnitId: string,
    @Body() dto: MeasurementUnitDto,
  ) {
    return this.measurementUnitService.updateOne(measurementUnitId, dto);
  }

  @Patch('archive/:id')
  async archiveOne(@Param('id') measurementUnitId: string) {
    return this.measurementUnitService.archiveOne(measurementUnitId);
  }

  @Patch('archive-multiple')
  async archiveMultiple(
    @Body() measurementUnitIds: MeasurementUnitDeleteManyDto,
  ) {
    return this.measurementUnitService.archiveMultiple(measurementUnitIds);
  }

  @Patch('restore/:id')
  async restoreOne(@Param('id') measurementUnitId: string) {
    return this.measurementUnitService.restoreOne(measurementUnitId);
  }

  @Patch('restore-multiple')
  async restoreMany(@Body() measurementUnitIds: MeasurementUnitDeleteManyDto) {
    return this.measurementUnitService.restoreMultiple(measurementUnitIds);
  }

  @Delete('delete/:id')
  async deleteOne(@Param('id') measurementUnitId: string) {
    return this.measurementUnitService.deleteOne(measurementUnitId);
  }

  @Delete('delete-multiple')
  async deleteMany(@Body() measurementUnitIds: MeasurementUnitDeleteManyDto) {
    return this.measurementUnitService.deleteMultiple(measurementUnitIds);
  }
}
