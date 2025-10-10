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
import { CustomerService } from './customer.service';
import { CustomerDeleteManyDto, CustomerDto } from './dto';

@Roles(Role.OWNER, Role.MANAGER)
@UseGuards(RoleGuard)
@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('all')
  @PublicRole()
  getAllCustomers(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('customer_name') customer_name: string,
    @Query('customer_phone') customer_phone: string,
    @Query('customer_email') customer_email: string,
    @Query('customer_address') customer_address: string,
    @Query('customer_city') customer_city: string,
    @Query('customer_country') customer_country: string,
  ) {
    return this.customerService.getAllCustomers(
      companyId,
      page,
      limit,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      customer_city,
      customer_country,
    );
  }

  @Get('all/archived')
  @PublicRole()
  getAllArchivedCustomers(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('customer_name') customer_name: string,
    @Query('customer_phone') customer_phone: string,
    @Query('customer_email') customer_email: string,
    @Query('customer_address') customer_address: string,
    @Query('customer_city') customer_city: string,
    @Query('customer_country') customer_country: string,
  ) {
    return this.customerService.getAllArchivedCustomers(
      companyId,
      page,
      limit,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      customer_city,
      customer_country,
    );
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createOne(@GetCompanyId() companyId: string, @Body() dto: CustomerDto) {
    return this.customerService.createOne(companyId, dto);
  }

  @Patch('update/:id')
  updateOne(@Param('id') customerId: string, @Body() dto: CustomerDto) {
    return this.customerService.updateOne(customerId, dto);
  }

  @Patch('archive/:id')
  archiveOne(@Param('id') customerId: string) {
    return this.customerService.archiveOne(customerId);
  }

  @Patch('archive-multiple')
  archiveMultiple(@Body() customerIds: CustomerDeleteManyDto) {
    return this.customerService.archiveMultiple(customerIds);
  }
  @Patch('restore/:id')
  restoreOne(@Param('id') customerId: string) {
    return this.customerService.restoreOne(customerId);
  }

  @Patch('restore-multiple')
  restoreMultiple(@Body() customerIds: CustomerDeleteManyDto) {
    return this.customerService.restoreMultiple(customerIds);
  }

  @Delete('delete/:id')
  deleteOne(@Param('id') customerId: string) {
    return this.customerService.deleteOne(customerId);
  }

  @Delete('delete-multiple')
  deleteMultiple(@Body() customerIds: CustomerDeleteManyDto) {
    return this.customerService.deleteMultiple(customerIds);
  }
}
