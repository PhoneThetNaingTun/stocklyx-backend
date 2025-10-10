import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BrandDto } from './dto';
import { BrandDeleteManyDto } from './dto/brand-delete.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async getAllBrands(
    companyId: string,
    page: number,
    limit: number,
    brand_name: string,
  ) {
    try {
      const skip = (page - 1) * limit;

      const where = {
        companyId,
        ...(brand_name && {
          brand_name: {
            contains: brand_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        deletedAt: null,
      };

      const brands = await this.prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const totalCounts = await this.prisma.brand.count({ where });
      const totalPages = Math.ceil(totalCounts / limit);

      return {
        brands,
        totalPages,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error getting brands']);
    }
  }

  async getAllArchivedBrands(
    companyId: string,
    page: number,
    limit: number,
    brand_name: string,
  ) {
    try {
      const skip = (page - 1) * limit;

      const where = {
        companyId,
        ...(brand_name && {
          brand_name: {
            contains: brand_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        deletedAt: { not: null },
      };

      const brands = await this.prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { deletedAt: 'desc' },
      });

      const totalCounts = await this.prisma.brand.count({ where });
      const totalPages = Math.ceil(totalCounts / limit);

      return {
        brands,
        totalPages,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error getting archived brands']);
    }
  }

  async createBrand(companyId: string, dto: BrandDto) {
    try {
      const newBrand = await this.prisma.brand.create({
        data: {
          companyId,
          ...dto,
        },
      });
      return {
        newBrand,
        message: `${newBrand.brand_name} Created Successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error creating brand']);
    }
  }

  async updateBrand(brandId: string, dto: BrandDto) {
    try {
      const isExist = await this.prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (!isExist) {
        throw new NotFoundException(['Brand not found']);
      }
      const updatedBrand = await this.prisma.brand.update({
        where: { id: brandId },
        data: { ...dto },
      });

      return {
        message: `${updatedBrand.brand_name} Updated Successfully`,
        data: updatedBrand,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error updating brand']);
    }
  }

  async archiveOne(brandId: string) {
    try {
      const isExist = await this.prisma.brand.findUnique({
        where: { id: brandId },
      });

      if (!isExist) {
        throw new NotFoundException(['Brand not found']);
      }
      const archivedBrand = await this.prisma.brand.update({
        where: { id: brandId },
        data: { deletedAt: new Date() },
      });
      return {
        message: `${archivedBrand.brand_name} Archived Successfully`,
        data: archivedBrand,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error archiving brand']);
    }
  }

  async archiveMultiple(brandIds: BrandDeleteManyDto) {
    try {
      const isExist = await this.prisma.brand.findMany({
        where: { id: { in: brandIds.brandIds } },
      });
      if (!isExist) throw new NotFoundException(['Brand Not Found!']);

      const archivedBrands = await this.prisma.brand.updateMany({
        where: { id: { in: brandIds.brandIds } },
        data: { deletedAt: new Date() },
      });
      return {
        message: `${archivedBrands.count} Brands Archived Successfully`,
        data: archivedBrands,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error archiving brands']);
    }
  }

  async restoreOne(brandId: string) {
    try {
      const isExist = await this.prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (!isExist) throw new NotFoundException(['Brand Not Found!']);
      const updatedBrand = await this.prisma.brand.update({
        where: { id: brandId },
        data: { deletedAt: null },
      });
      return {
        message: `${updatedBrand.brand_name} Restored Successfully`,
        data: updatedBrand,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error restoring brand']);
    }
  }

  async restoreMultiple(brandIds: BrandDeleteManyDto) {
    try {
      const isExist = await this.prisma.brand.findMany({
        where: { id: { in: brandIds.brandIds } },
      });
      if (!isExist) throw new NotFoundException(['Brand Not Found!']);
      const restoredBrands = await this.prisma.brand.updateMany({
        where: { id: { in: brandIds.brandIds } },
        data: { deletedAt: null },
      });
      return {
        message: `${restoredBrands.count} Brands Restored Successfully`,
        data: restoredBrands,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error restoring brands']);
    }
  }

  async deleteOne(brandId: string) {
    try {
      const existingBrand = await this.prisma.brand.findUnique({
        where: { id: brandId, deletedAt: { not: null } },
      });
      if (!existingBrand) throw new NotFoundException(['Brand Not Found!']);
      await this.prisma.brand.delete({ where: { id: existingBrand.id } });
      return { message: 'Brand Deleted Successfully!' };
    } catch (error) {
      throw new InternalServerErrorException(['Error deleting brand']);
    }
  }

  async deleteMultiple(brandIds: BrandDeleteManyDto) {
    try {
      const deleteBrands = await this.prisma.brand.deleteMany({
        where: { id: { in: brandIds.brandIds } },
      });
      return { message: `${deleteBrands.count} Brands Deleted Successfully!` };
    } catch (error) {
      throw new InternalServerErrorException(['Error deleting brand']);
    }
  }
}
