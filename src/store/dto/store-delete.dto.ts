import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class StoreDeleteManyDto {
  @IsArray({ message: 'storeIds must be an array' })
  @ArrayNotEmpty({ message: 'storeIds cannot be empty' })
  @IsString({ each: true, message: 'Each storeId must be a string' })
  @IsNotEmpty({ each: true, message: 'storeId cannot be empty' })
  storeIds: string[];
}
