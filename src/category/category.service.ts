import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDeleteManyDto, CategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAll(
    companyId: string,
    page: number,
    limit: number,
    category_name: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        companyId,
        deletedAt: null,
        ...(category_name && {
          category_name: {
            contains: category_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };
      const categories = await this.prisma.category.findMany({
        where: { ...where },
        skip,
        take: limit,
      });

      const totalCounts = await this.prisma.category.count({
        where: { ...where },
      });
      const totalPages = Math.ceil(totalCounts / limit);
      return { categories, totalPages };
    } catch (error) {
      throw new InternalServerErrorException(['Error getting categories']);
    }
  }
  async getAllArchive(
    companyId: string,
    page: number,
    limit: number,
    category_name: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        companyId,
        deletedAt: { not: null },
        ...(category_name && {
          category_name: {
            contains: category_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };
      const categories = await this.prisma.category.findMany({
        where: { ...where },
        skip,
        take: limit,
      });

      const totalCounts = await this.prisma.category.count({
        where: { ...where },
      });
      const totalPages = Math.ceil(totalCounts / limit);
      return { categories, totalPages };
    } catch (error) {
      throw new InternalServerErrorException(['Error getting categories']);
    }
  }

  async createOne(companyId: string, dto: CategoryDto) {
    try {
      const newCategory = await this.prisma.category.create({
        data: { ...dto, companyId: companyId },
      });
      return {
        message: `${newCategory.category_name} Created Successfully`,
        data: newCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error creating category']);
    }
  }

  async updateOne(categoryId: string, dto: CategoryDto) {
    try {
      const isExist = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!isExist) throw new NotFoundException([['Category Not Found!']]);

      const updatedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: { ...dto },
      });
      return {
        message: `${updatedCategory.category_name} Updated Successfully`,
        data: updatedCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error updating category']);
    }
  }

  async archiveOne(categoryId: string) {
    try {
      const isExist = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!isExist) throw new NotFoundException(['Category Not Found!']);
      const updatedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: { deletedAt: new Date() },
      });
      return {
        message: `${updatedCategory.category_name} Archived Successfully`,
        data: updatedCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error archiving category']);
    }
  }

  async archiveMultiple(categoryIds: CategoryDeleteManyDto) {
    try {
      const isExist = await this.prisma.category.findMany({
        where: { id: { in: categoryIds.categoryIds } },
      });
      if (!isExist) throw new NotFoundException(['Category Not Found!']);
      const updatedCategory = await this.prisma.category.updateMany({
        where: { id: { in: categoryIds.categoryIds } },
        data: { deletedAt: new Date() },
      });
      return {
        message: `${updatedCategory.count} Categories Archived Successfully`,
        data: updatedCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error archiving category']);
    }
  }

  async restoreOne(categoryId: string) {
    try {
      const isExist = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!isExist) throw new NotFoundException(['Category Not Found!']);
      const updatedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: { deletedAt: null },
      });
      return {
        message: `${updatedCategory.category_name} Restored Successfully`,
        data: updatedCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error restoring category']);
    }
  }

  async restoreMany(dto: CategoryDeleteManyDto) {
    try {
      const restoreCategories = await this.prisma.category.updateMany({
        where: { id: { in: dto.categoryIds } },
        data: { deletedAt: null },
      });
      return {
        message: `${restoreCategories.count} Categories Restored Successfully!`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error restoring category']);
    }
  }

  async deleteOne(categoryId: string) {
    try {
      const isExist = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!isExist) throw new NotFoundException(['Category Not Found!']);
      const deletedCategory = await this.prisma.category.delete({
        where: { id: categoryId },
      });
      return {
        message: `${deletedCategory.category_name} Deleted Successfully`,
        data: deletedCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error deleting category']);
    }
  }

  async deleteMany(dto: CategoryDeleteManyDto) {
    try {
      const deleteCategories = await this.prisma.category.deleteMany({
        where: { id: { in: dto.categoryIds } },
      });
      return {
        message: `${deleteCategories.count} Categories Deleted Successfully!`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error deleting category']);
    }
  }
}
