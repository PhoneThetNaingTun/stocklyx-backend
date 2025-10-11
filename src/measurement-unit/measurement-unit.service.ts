import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MeasurementUnitDeleteManyDto, MeasurementUnitDto } from './dto';

@Injectable()
export class MeasurementUnitService {
  constructor(private prisma: PrismaService) {}

  async getAll(companyId: string, page: number, limit: number, unit: string) {
    try {
      const skip = (page - 1) * limit;

      const where = {
        companyId,
        deletedAt: null,
        ...(unit && {
          unit: { contains: unit, mode: Prisma.QueryMode.insensitive },
        }),
      };

      const measurementUnits = await this.prisma.measurementUnit.findMany({
        where: where,
        skip,
        take: limit,
      });

      const totalCounts = await this.prisma.measurementUnit.count({
        where: where,
      });
      const totalPages = Math.ceil(totalCounts / limit);

      return { measurementUnits, totalPages };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error finding measurement units',
      ]);
    }
  }

  async getAllArchives(
    companyId: string,
    page: number,
    limit: number,
    unit: string,
  ) {
    try {
      const skip = (page - 1) * limit;

      const where = {
        companyId,
        deletedAt: { not: null },
        ...(unit && {
          unit: { contains: unit, mode: Prisma.QueryMode.insensitive },
        }),
      };

      const measurementUnits = await this.prisma.measurementUnit.findMany({
        where: where,
        skip,
        take: limit,
      });

      const totalCounts = await this.prisma.measurementUnit.count({
        where: where,
      });
      const totalPages = Math.ceil(totalCounts / limit);

      return { measurementUnits, totalPages };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error finding archived measurement units',
      ]);
    }
  }

  async createOne(companyId: string, dto: MeasurementUnitDto) {
    try {
      const newMeasurementUnit = await this.prisma.measurementUnit.create({
        data: { ...dto, companyId: companyId },
      });
      return {
        message: `${newMeasurementUnit.unit} Created Successfully`,
        newMeasurementUnit,
      };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error creating measurement unit',
      ]);
    }
  }

  async updateOne(measurementUnitId: string, dto: MeasurementUnitDto) {
    try {
      const isExist = await this.prisma.measurementUnit.findUnique({
        where: { id: measurementUnitId },
      });

      if (!isExist) throw new NotFoundException(['Measurement unit not found']);

      const updatedMeasurementUnit = await this.prisma.measurementUnit.update({
        where: { id: measurementUnitId },
        data: { ...dto },
      });
      return {
        message: `${updatedMeasurementUnit.unit} updated successfully`,
        updatedMeasurementUnit,
      };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error updating measurement unit',
      ]);
    }
  }

  async archiveOne(measurementUnitId: string) {
    try {
      const isExist = await this.prisma.measurementUnit.findUnique({
        where: { id: measurementUnitId },
      });

      if (!isExist) throw new NotFoundException(['Measurement unit not found']);

      const archivedMeasurementUnit = await this.prisma.measurementUnit.update({
        where: { id: measurementUnitId },
        data: { deletedAt: new Date() },
      });
      return {
        message: `${archivedMeasurementUnit.unit} archived successfully`,
        archivedMeasurementUnit,
      };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error archiving measurement unit',
      ]);
    }
  }

  async archiveMultiple(measurementUnitIds: MeasurementUnitDeleteManyDto) {
    try {
      const isExist = await this.prisma.measurementUnit.findMany({
        where: { id: { in: measurementUnitIds.measurementUnitIds } },
      });
      if (isExist.length === 0) {
        throw new NotFoundException(['Measurement unit do not exist']);
      }
      const archivedMeasurementUnits =
        await this.prisma.measurementUnit.updateMany({
          where: { id: { in: measurementUnitIds.measurementUnitIds } },
          data: { deletedAt: new Date() },
        });
      return {
        archivedMeasurementUnits,
        message: `${archivedMeasurementUnits.count} Measurement units archived successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error archiving measurement units',
      ]);
    }
  }

  async restoreOne(measurementUnitId: string) {
    try {
      const isExist = await this.prisma.measurementUnit.findUnique({
        where: { id: measurementUnitId },
      });
      if (!isExist) throw new NotFoundException(['Measurement unit not found']);
      const restoredMeasurementUnit = await this.prisma.measurementUnit.update({
        where: { id: measurementUnitId },
        data: { deletedAt: null },
      });
      return {
        message: `${restoredMeasurementUnit.unit} restored successfully`,
        restoredMeasurementUnit,
      };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error restoring measurement unit',
      ]);
    }
  }

  async restoreMultiple(measurementUnitIds: MeasurementUnitDeleteManyDto) {
    try {
      const isExist = await this.prisma.measurementUnit.findMany({
        where: { id: { in: measurementUnitIds.measurementUnitIds } },
      });
      if (isExist.length === 0) {
        throw new NotFoundException(['Measurement unit do not exist']);
      }
      const restoredMeasurementUnits =
        await this.prisma.measurementUnit.updateMany({
          where: { id: { in: measurementUnitIds.measurementUnitIds } },
          data: { deletedAt: null },
        });
      return {
        restoredMeasurementUnits,
        message: `${restoredMeasurementUnits.count} Measurement units restored successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error restoring measurement units',
      ]);
    }
  }

  async deleteOne(measurementUnitId: string) {
    try {
      const isExist = await this.prisma.measurementUnit.findUnique({
        where: { id: measurementUnitId },
      });
      if (!isExist) throw new NotFoundException(['Measurement unit not found']);
      const deletedMeasurementUnit = await this.prisma.measurementUnit.delete({
        where: { id: measurementUnitId },
      });
      return {
        message: `${deletedMeasurementUnit.unit} deleted successfully`,
        deletedMeasurementUnit,
      };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error deleting measurement unit',
      ]);
    }
  }

  async deleteMultiple(measurementUnitIds: MeasurementUnitDeleteManyDto) {
    try {
      const isExist = await this.prisma.measurementUnit.findMany({
        where: { id: { in: measurementUnitIds.measurementUnitIds } },
      });
      if (isExist.length === 0) {
        throw new NotFoundException(['Measurement unit do not exist']);
      }
      const deletedMeasurementUnits =
        await this.prisma.measurementUnit.deleteMany({
          where: { id: { in: measurementUnitIds.measurementUnitIds } },
        });
      return {
        deletedMeasurementUnits,
        message: `${deletedMeasurementUnits.count} Measurement units deleted successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException([
        'Error deleting measurement units',
      ]);
    }
  }
}
