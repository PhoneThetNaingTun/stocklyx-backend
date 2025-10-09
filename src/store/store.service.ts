import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreDeleteManyDto } from './dto';
import { StoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async findOne(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) throw new NotFoundException(['Store Not Found!']);
    return store;
  }

  async findAll(
    companyId: string,
    page: number,
    limit: number,
    store_name: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        companyId,
        deletedAt: null,
        ...(store_name && {
          store_name: {
            contains: store_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };
      const stores = await this.prisma.store.findMany({
        where: {
          ...where,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const totalCounts = await this.prisma.store.count({
        where: { ...where },
      });
      const totalPages = Math.ceil(totalCounts / limit);
      return { stores, totalPages };
    } catch (error) {
      throw new InternalServerErrorException(['Error finding stores']);
    }
  }

  async findAllArchive(
    companyId: string,
    page: number,
    limit: number,
    store_name: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        companyId,
        deletedAt: { not: null },
        ...(store_name && {
          store_name: {
            contains: store_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };
      const stores = await this.prisma.store.findMany({
        where: {
          ...where,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const totalCounts = await this.prisma.store.count({
        where: { ...where },
      });
      const totalPages = Math.ceil(totalCounts / limit);
      return { stores, totalPages };
    } catch (error) {
      throw new InternalServerErrorException(['Error finding stores']);
    }
  }

  async createOne(companyId: string, dto: StoreDto) {
    try {
      const newStore = await this.prisma.store.create({
        data: { ...dto, companyId },
      });
      return {
        message: `${newStore.store_name} Created Successfully`,
        data: newStore,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error creating store']);
    }
  }

  async updateOne(storeId: string, dto: StoreDto) {
    try {
      const existingStore = await this.prisma.store.findUnique({
        where: { id: storeId },
      });
      if (!existingStore) throw new NotFoundException(['Store Not Found!']);
      const updatedStore = await this.prisma.store.update({
        where: { id: storeId },
        data: { ...dto },
      });
      return {
        message: `${updatedStore.store_name} Updated Successfully`,
        data: updatedStore,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error updating store']);
    }
  }

  async archiveOne(storeId: string) {
    try {
      const existingStore = await this.prisma.store.findUnique({
        where: { id: storeId },
      });
      if (!existingStore) throw new NotFoundException(['Store Not Found!']);
      await this.prisma.store.update({
        where: { id: storeId },
        data: { deletedAt: new Date() },
      });
      return { message: 'Store Archived Successfully!' };
    } catch (error) {
      throw new InternalServerErrorException(['Error archiving store']);
    }
  }

  async archiveMany(dto: StoreDeleteManyDto) {
    try {
      const archiveStores = await this.prisma.store.updateMany({
        where: { id: { in: dto.storeIds } },
        data: { deletedAt: new Date() },
      });
      return {
        message: `${archiveStores.count} Stores Archived Successfully!`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error archiving store']);
    }
  }

  async restoreOne(storeId: string) {
    try {
      const existingStore = await this.prisma.store.findUnique({
        where: { id: storeId },
      });
      if (!existingStore) throw new NotFoundException(['Store Not Found!']);
      await this.prisma.store.update({
        where: { id: storeId },
        data: { deletedAt: null },
      });
      return { message: 'Store Restored Successfully!' };
    } catch (error) {
      throw new InternalServerErrorException(['Error restoring store']);
    }
  }

  async restoreMany(dto: StoreDeleteManyDto) {
    try {
      const restoreStores = await this.prisma.store.updateMany({
        where: { id: { in: dto.storeIds } },
        data: { deletedAt: null },
      });
      return {
        message: `${restoreStores.count} Stores Restored Successfully!`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error restoring store']);
    }
  }

  async deleteOne(storeId: string) {
    try {
      const existingStore = await this.prisma.store.findUnique({
        where: { id: storeId, deletedAt: { not: null } },
      });
      if (!existingStore) throw new NotFoundException(['Store Not Found!']);
      await this.prisma.store.delete({ where: { id: existingStore.id } });
      return { message: 'Store Deleted Successfully!' };
    } catch (error) {
      throw new InternalServerErrorException(['Error deleting store']);
    }
  }

  async deleteMany(dto: StoreDeleteManyDto) {
    try {
      const deleteStores = await this.prisma.store.deleteMany({
        where: { id: { in: dto.storeIds } },
      });
      return { message: `${deleteStores.count} Stores Deleted Successfully!` };
    } catch (error) {
      throw new InternalServerErrorException(['Error deleting store']);
    }
  }
}
