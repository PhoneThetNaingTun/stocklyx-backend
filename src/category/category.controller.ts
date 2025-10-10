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
import { CategoryService } from './category.service';
import { CategoryDeleteManyDto, CategoryDto } from './dto';

@Roles(Role.OWNER)
@UseGuards(RoleGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('all')
  @PublicRole()
  getAll(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('category_name') category_name: string,
  ) {
    return this.categoryService.getAll(companyId, page, limit, category_name);
  }
  @Get('all/archived')
  @PublicRole()
  getAllArchive(
    @GetCompanyId() companyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('category_name') category_name: string,
  ) {
    return this.categoryService.getAllArchive(
      companyId,
      page,
      limit,
      category_name,
    );
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createOne(@GetCompanyId() companyId: string, @Body() dto: CategoryDto) {
    return this.categoryService.createOne(companyId, dto);
  }

  @Patch('update/:id')
  async updateOne(@Param('id') categoryId: string, @Body() dto: CategoryDto) {
    return this.categoryService.updateOne(categoryId, dto);
  }

  @Patch('archive/:id')
  async archiveOne(@Param('id') categoryId: string) {
    return this.categoryService.archiveOne(categoryId);
  }

  @Patch('archive-multiple')
  async archiveMultiple(@Body() categoryIds: CategoryDeleteManyDto) {
    return this.categoryService.archiveMultiple(categoryIds);
  }

  @Patch('restore/:id')
  async restoreOne(@Param('id') categoryId: string) {
    return this.categoryService.restoreOne(categoryId);
  }

  @Patch('restore-multiple')
  async restoreMany(@Body() categoryIds: CategoryDeleteManyDto) {
    return this.categoryService.restoreMany(categoryIds);
  }

  @Delete('delete/:id')
  async deleteOne(@Param('id') categoryId: string) {
    return this.categoryService.deleteOne(categoryId);
  }

  @Delete('delete-multiple')
  async deleteMany(@Body() categoryIds: CategoryDeleteManyDto) {
    return this.categoryService.deleteMany(categoryIds);
  }
}
