import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SupplierDeleteDto {
  @IsArray({ message: 'supplierIds must be an array' })
  @ArrayNotEmpty({ message: 'supplierIds cannot be empty' })
  @IsString({ each: true, message: 'Each supplierId must be a string' })
  @IsNotEmpty({ each: true, message: 'supplierId cannot be empty' })
  supplierIds: string[];
}
