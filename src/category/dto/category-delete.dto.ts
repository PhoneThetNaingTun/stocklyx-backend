import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CategoryDeleteManyDto {
  @IsArray({ message: 'categoryIds must be an array' })
  @ArrayNotEmpty({ message: 'categoryIds cannot be empty' })
  @IsString({ each: true, message: 'Each categoryId must be a string' })
  @IsNotEmpty({ each: true, message: 'categoryId cannot be empty' })
  categoryIds: string[];
}
