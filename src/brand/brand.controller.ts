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
import { BrandService } from './brand.service';
import { BrandDto } from './dto';
import { BrandDeleteManyDto } from './dto/brand-delete.dto';

@Roles(Role.OWNER)
@UseGuards(RoleGuard)
@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get('all')
  @PublicRole()
  getAllBrands(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('brand_name') brand_name: string,
  ) {
    return this.brandService.getAllBrands(companyId, page, limit, brand_name);
  }

  @Get('all/archived')
  @PublicRole()
  getAllArchivedBrands(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('brand_name') brand_name: string,
  ) {
    return this.brandService.getAllArchivedBrands(
      companyId,
      page,
      limit,
      brand_name,
    );
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createBrand(@GetCompanyId() companyId: string, @Body() dto: BrandDto) {
    return this.brandService.createBrand(companyId, dto);
  }

  @Patch('update/:id')
  updateBrand(@Param('id') brandId: string, @Body() dto: BrandDto) {
    return this.brandService.updateBrand(brandId, dto);
  }

  @Patch('archive/:id')
  archiveBrand(@Param('id') brandId: string) {
    return this.brandService.archiveOne(brandId);
  }

  @Patch('archive-multiple')
  archiveMultipleBrands(@Body() dto: BrandDeleteManyDto) {
    return this.brandService.archiveMultiple(dto);
  }

  @Patch('restore/:id')
  restoreBrand(@Param('id') brandId: string) {
    return this.brandService.restoreOne(brandId);
  }

  @Patch('restore-multiple')
  restoreMultipleBrands(@Body() dto: BrandDeleteManyDto) {
    return this.brandService.restoreMultiple(dto);
  }

  @Delete('delete/:id')
  deleteBrand(@Param('id') brandId: string) {
    return this.brandService.deleteOne(brandId);
  }

  @Delete('delete-multiple')
  deleteMultipleBrands(@Body() dto: BrandDeleteManyDto) {
    return this.brandService.deleteMultiple(dto);
  }
}
