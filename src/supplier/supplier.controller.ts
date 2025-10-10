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
import { SupplierDeleteDto, SupplierDto } from './dto';
import { SupplierService } from './supplier.service';

@Roles(Role.OWNER, Role.MANAGER)
@UseGuards(RoleGuard)
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}
  @Get('all')
  @PublicRole()
  getAllSuppliers(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('supplier_name') supplier_name: string,
    @Query('supplier_phone') supplier_phone: string,
    @Query('supplier_email') supplier_email: string,
    @Query('supplier_address') supplier_address: string,
    @Query('supplier_city') supplier_city: string,
    @Query('supplier_country') supplier_country: string,
  ) {
    return this.supplierService.getAllSuppliers(
      companyId,
      page,
      limit,
      supplier_name,
      supplier_phone,
      supplier_email,
      supplier_address,
      supplier_city,
      supplier_country,
    );
  }

  @Get('all/archived')
  @PublicRole()
  getAllArchivedSuppliers(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('supplier_name') supplier_name: string,
    @Query('supplier_phone') supplier_phone: string,
    @Query('supplier_email') supplier_email: string,
    @Query('supplier_address') supplier_address: string,
    @Query('supplier_city') supplier_city: string,
    @Query('supplier_country') supplier_country: string,
  ) {
    return this.supplierService.getAllArchivedSuppliers(
      companyId,
      page,
      limit,
      supplier_name,
      supplier_phone,
      supplier_email,
      supplier_address,
      supplier_city,
      supplier_country,
    );
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createOne(@GetCompanyId() companyId: string, @Body() dto: SupplierDto) {
    return this.supplierService.createOne(companyId, dto);
  }

  @Patch('update/:id')
  updateOne(@Param('id') supplierId: string, @Body() dto: SupplierDto) {
    return this.supplierService.updateOne(supplierId, dto);
  }

  @Patch('archive/:id')
  archiveOne(@Param('id') supplierId: string) {
    return this.supplierService.archiveOne(supplierId);
  }

  @Patch('archive-multiple')
  archiveMultiple(@Body() supplierIds: SupplierDeleteDto) {
    return this.supplierService.archiveMultiple(supplierIds);
  }
  @Patch('restore/:id')
  restoreOne(@Param('id') supplierId: string) {
    return this.supplierService.restoreOne(supplierId);
  }

  @Patch('restore-multiple')
  restoreMultiple(@Body() supplierIds: SupplierDeleteDto) {
    return this.supplierService.restoreMultiple(supplierIds);
  }

  @Delete('delete/:id')
  deleteOne(@Param('id') supplierId: string) {
    return this.supplierService.deleteOne(supplierId);
  }

  @Delete('delete-multiple')
  deleteMultiple(@Body() supplierIds: SupplierDeleteDto) {
    return this.supplierService.deleteMultiple(supplierIds);
  }
}
