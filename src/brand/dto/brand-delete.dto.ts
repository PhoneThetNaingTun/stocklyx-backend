import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class BrandDeleteManyDto {
  @IsArray({ message: 'brandIds must be an array' })
  @ArrayNotEmpty({ message: 'brandIds cannot be empty' })
  @IsString({ each: true, message: 'Each brandId must be a string' })
  @IsNotEmpty({ each: true, message: 'brandId cannot be empty' })
  brandIds: string[];
}
