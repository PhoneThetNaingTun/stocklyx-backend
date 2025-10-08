import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async findOne(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) throw new NotFoundException('Store Not Found!');
    return store;
  }

  async findAll(
    companyId: string,
    page: number,
    limit: number,
    store_name: string,
  ) {
    const skip = (page - 1) * limit;
    const where = store_name
      ? {
          store_name: {
            contains: store_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};
    const stores = await this.prisma.store.findMany({
      where: {
        companyId,
        ...where,
      },
      skip,
      take: limit,
      // orderBy:{createdAt:"decs"}
    });

    const totalCounts = await this.prisma.store.count({ where: { companyId } });
    const totalPages = Math.ceil(totalCounts / limit);
    return { stores, totalPages };
  }

  async createOne(companyId: string, dto: StoreDto) {
    const newStore = await this.prisma.store.create({
      data: { ...dto, companyId },
    });
    return {
      message: `${newStore.store_name} Created Successfully`,
      data: newStore,
    };
  }

  async updateOne(storeId: string, dto: StoreDto) {
    const existingStore = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!existingStore) throw new NotFoundException('Store Not Found!');
    const updatedStore = await this.prisma.store.update({
      where: { id: storeId },
      data: { ...dto },
    });
    return {
      message: `${updatedStore.store_name} Updated Successfully`,
      data: updatedStore,
    };
  }

  async deleteOne(storeId: string) {
    const existingStore = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!existingStore) throw new NotFoundException('Store Not Found!');
    await this.prisma.store.delete({ where: { id: storeId } });
    return { message: 'Store Deleted Successfully!' };
  }
}
