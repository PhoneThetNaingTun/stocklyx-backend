import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplierDeleteDto, SupplierDto } from './dto';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async getAllSuppliers(
    companyId: string,
    page: number,
    limit: number,
    supplier_name: string,
    supplier_phone: string,
    supplier_email: string,
    supplier_address: string,
    supplier_city: string,
    supplier_country: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        companyId,
        deletedAt: null,
        ...(supplier_name && {
          supplier_name: {
            contains: supplier_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(supplier_phone && {
          supplier_phone: {
            contains: supplier_phone,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(supplier_email && {
          supplier_email: {
            contains: supplier_email,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(supplier_address && {
          supplier_address: {
            contains: supplier_address,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(supplier_city && {
          supplier_city: {
            contains: supplier_city,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(supplier_country && {
          supplier_country: {
            contains: supplier_country,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };

      const suppliers = await this.prisma.supplier.findMany({
        where: where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const totalCounts = await this.prisma.supplier.count({ where: where });
      const totalPages = Math.ceil(totalCounts / limit);
      return { suppliers, totalPages };
    } catch (error) {
      throw new InternalServerErrorException(['Error getting suppliers']);
    }
  }

  async getAllArchivedSuppliers(
    companyId: string,
    page: number,
    limit: number,
    supplier_name: string,
    supplier_phone: string,
    supplier_email: string,
    supplier_address: string,
    supplier_city: string,
    supplier_country: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        companyId,
        deletedAt: { not: null },
        ...(supplier_name && {
          supplier_name: {
            contains: supplier_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(supplier_phone && {
          supplier_phone: {
            contains: supplier_phone,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(supplier_email && {
          supplier_email: {
            contains: supplier_email,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(supplier_address && {
          supplier_address: {
            contains: supplier_address,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(supplier_city && {
          supplier_city: {
            contains: supplier_city,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(supplier_country && {
          supplier_country: {
            contains: supplier_country,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };

      const suppliers = await this.prisma.supplier.findMany({
        where: where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const totalCounts = await this.prisma.supplier.count({ where: where });
      const totalPages = Math.ceil(totalCounts / limit);
      return { suppliers, totalPages };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error getting archive suppliers',
      ]);
    }
  }

  async createOne(companyId: string, dto: SupplierDto) {
    try {
      const newSupplier = await this.prisma.supplier.create({
        data: { ...dto, companyId },
      });
      return {
        newSupplier,
        message: `${newSupplier.supplier_name} created successfully`,
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(['Error creating supplier']);
    }
  }

  async updateOne(supplierId: string, dto: SupplierDto) {
    try {
      const isExist = await this.prisma.supplier.findUnique({
        where: { id: supplierId },
      });
      if (!isExist) {
        throw new NotFoundException(['Supplier does not exist']);
      }
      const updatedSupplier = await this.prisma.supplier.update({
        where: { id: supplierId },
        data: { ...dto },
      });
      return {
        updatedSupplier,
        message: `${updatedSupplier.supplier_name} updated successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error updating supplier']);
    }
  }

  async archiveOne(supplierId: string) {
    try {
      const isExist = await this.prisma.supplier.findUnique({
        where: { id: supplierId },
      });
      if (!isExist) {
        throw new NotFoundException(['Supplier does not exist']);
      }

      const archivedSupplier = await this.prisma.supplier.update({
        where: { id: supplierId },
        data: { deletedAt: new Date() },
      });
      return {
        archivedSupplier,
        message: `${archivedSupplier.supplier_name} archived successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error archiving supplier']);
    }
  }

  async archiveMultiple(supplierIds: SupplierDeleteDto) {
    try {
      const isExist = await this.prisma.supplier.findMany({
        where: { id: { in: supplierIds.supplierIds } },
      });
      if (isExist.length === 0) {
        throw new NotFoundException(['Supplier do not exist']);
      }
      const archivedSupplier = await this.prisma.supplier.updateMany({
        where: { id: { in: supplierIds.supplierIds } },
        data: { deletedAt: new Date() },
      });
      return {
        archivedSupplier,
        message: `${archivedSupplier.count} Supplier archived successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error archiving suppliers']);
    }
  }

  async restoreOne(supplierId: string) {
    try {
      const isExist = await this.prisma.supplier.findUnique({
        where: { id: supplierId },
      });
      if (!isExist) throw new NotFoundException(['supplier Not Found!']);
      const updatedSupplier = await this.prisma.supplier.update({
        where: { id: supplierId },
        data: { deletedAt: null },
      });
      return {
        message: `${updatedSupplier.supplier_name} Restored Successfully`,
        data: updatedSupplier,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error restoring supplier']);
    }
  }

  async restoreMultiple(supplierIds: SupplierDeleteDto) {
    try {
      const isExist = await this.prisma.supplier.findMany({
        where: { id: { in: supplierIds.supplierIds } },
      });
      if (!isExist) throw new NotFoundException(['Supplier Not Found!']);
      const restoredSuppliers = await this.prisma.supplier.updateMany({
        where: { id: { in: supplierIds.supplierIds } },
        data: { deletedAt: null },
      });
      return {
        message: `${restoredSuppliers.count} Suppliers Restored Successfully`,
        data: restoredSuppliers,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error restoring Suppliers']);
    }
  }

  async deleteOne(supplierIds: string) {
    try {
      const isExist = await this.prisma.supplier.findUnique({
        where: { id: supplierIds },
      });
      if (!isExist) throw new NotFoundException(['Supplier Not Found!']);
      const deletedSupplier = await this.prisma.supplier.delete({
        where: { id: supplierIds },
      });
      return {
        message: `${deletedSupplier.supplier_name} Deleted Successfully`,
        data: deletedSupplier,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error deleting supplier']);
    }
  }
  async deleteMultiple(supplierIds: SupplierDeleteDto) {
    try {
      const isExist = await this.prisma.supplier.findMany({
        where: { id: { in: supplierIds.supplierIds } },
      });
      if (!isExist) throw new NotFoundException(['Supplier Not Found!']);
      const deletedSuppliers = await this.prisma.supplier.deleteMany({
        where: { id: { in: supplierIds.supplierIds } },
      });
      return {
        message: `${deletedSuppliers.count} Suppliers Deleted Successfully`,
        data: deletedSuppliers,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error deleting suppliers']);
    }
  }
}
