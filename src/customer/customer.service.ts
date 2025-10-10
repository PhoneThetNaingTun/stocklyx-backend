import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerDeleteManyDto, CustomerDto } from './dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getAllCustomers(
    companyId: string,
    page: number,
    limit: number,
    customer_name: string,
    customer_phone: string,
    customer_email: string,
    customer_address: string,
    customer_city: string,
    customer_country: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        companyId,
        deletedAt: null,
        ...(customer_name && {
          customer_name: {
            contains: customer_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(customer_phone && {
          customer_phone: {
            contains: customer_phone,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(customer_email && {
          customer_email: {
            contains: customer_email,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(customer_address && {
          customer_address: {
            contains: customer_address,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(customer_city && {
          customer_city: {
            contains: customer_city,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(customer_country && {
          customer_country: {
            contains: customer_country,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };

      const customers = await this.prisma.customer.findMany({
        where: where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const totalCounts = await this.prisma.customer.count({ where: where });
      const totalPages = Math.ceil(totalCounts / limit);
      return { customers, totalPages };
    } catch (error) {
      throw new InternalServerErrorException(['Error getting customers']);
    }
  }

  async getAllArchivedCustomers(
    companyId: string,
    page: number,
    limit: number,
    customer_name: string,
    customer_phone: string,
    customer_email: string,
    customer_address: string,
    customer_city: string,
    customer_country: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        companyId,
        deletedAt: { not: null },
        ...(customer_name && {
          customer_name: {
            contains: customer_name,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(customer_phone && {
          customer_phone: {
            contains: customer_phone,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(customer_email && {
          customer_email: {
            contains: customer_email,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(customer_address && {
          customer_address: {
            contains: customer_address,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(customer_city && {
          customer_city: {
            contains: customer_city,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(customer_country && {
          customer_country: {
            contains: customer_country,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };

      const customers = await this.prisma.customer.findMany({
        where: where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const totalCounts = await this.prisma.customer.count({ where: where });
      const totalPages = Math.ceil(totalCounts / limit);
      return { customers, totalPages };
    } catch (error) {
      throw new InternalServerErrorException(['Error getting customers']);
    }
  }

  async createOne(companyId: string, dto: CustomerDto) {
    try {
      const newCustomer = await this.prisma.customer.create({
        data: { ...dto, companyId },
      });
      return {
        newCustomer,
        message: `${newCustomer.customer_name} created successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error creating customer']);
    }
  }

  async updateOne(customerId: string, dto: CustomerDto) {
    try {
      const isExist = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!isExist) {
        throw new NotFoundException(['Customer does not exist']);
      }
      const updatedCustomer = await this.prisma.customer.update({
        where: { id: customerId },
        data: { ...dto },
      });
      return {
        updatedCustomer,
        message: `${updatedCustomer.customer_name} updated successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error updating customer']);
    }
  }

  async archiveOne(customerId: string) {
    try {
      const isExist = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!isExist) {
        throw new NotFoundException(['Customer does not exist']);
      }

      const archivedCustomer = await this.prisma.customer.update({
        where: { id: customerId },
        data: { deletedAt: new Date() },
      });
      return {
        archivedCustomer,
        message: `${archivedCustomer.customer_name} archived successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error archiving customer']);
    }
  }

  async archiveMultiple(customerIds: CustomerDeleteManyDto) {
    try {
      const isExist = await this.prisma.customer.findMany({
        where: { id: { in: customerIds.customerIds } },
      });
      if (isExist.length === 0) {
        throw new NotFoundException(['Customers do not exist']);
      }
      const archivedCustomers = await this.prisma.customer.updateMany({
        where: { id: { in: customerIds.customerIds } },
        data: { deletedAt: new Date() },
      });
      return {
        archivedCustomers,
        message: `${archivedCustomers.count} Customers archived successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error archiving customers']);
    }
  }

  async restoreOne(customerId: string) {
    try {
      const isExist = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!isExist) throw new NotFoundException(['Customer Not Found!']);
      const updatedCustomer = await this.prisma.customer.update({
        where: { id: customerId },
        data: { deletedAt: null },
      });
      return {
        message: `${updatedCustomer.customer_name} Restored Successfully`,
        data: updatedCustomer,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error restoring customer']);
    }
  }

  async restoreMultiple(customerIds: CustomerDeleteManyDto) {
    try {
      const isExist = await this.prisma.customer.findMany({
        where: { id: { in: customerIds.customerIds } },
      });
      if (!isExist) throw new NotFoundException(['Customer Not Found!']);
      const restoredCustomers = await this.prisma.customer.updateMany({
        where: { id: { in: customerIds.customerIds } },
        data: { deletedAt: null },
      });
      return {
        message: `${restoredCustomers.count} Customers Restored Successfully`,
        data: restoredCustomers,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error restoring customers']);
    }
  }

  async deleteOne(customerId: string) {
    try {
      const isExist = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!isExist) throw new NotFoundException(['Customer Not Found!']);
      const deletedCustomer = await this.prisma.customer.delete({
        where: { id: customerId },
      });
      return {
        message: `${deletedCustomer.customer_name} Deleted Successfully`,
        data: deletedCustomer,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error deleting customer']);
    }
  }
  async deleteMultiple(customerIds: CustomerDeleteManyDto) {
    try {
      const isExist = await this.prisma.customer.findMany({
        where: { id: { in: customerIds.customerIds } },
      });
      if (!isExist) throw new NotFoundException(['Customer Not Found!']);
      const deletedCustomers = await this.prisma.customer.deleteMany({
        where: { id: { in: customerIds.customerIds } },
      });
      return {
        message: `${deletedCustomers.count} Customers Deleted Successfully`,
        data: deletedCustomers,
      };
    } catch (error) {
      throw new InternalServerErrorException(['Error deleting customers']);
    }
  }
}
