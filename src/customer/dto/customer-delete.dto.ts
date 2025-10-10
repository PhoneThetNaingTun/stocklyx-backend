import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CustomerDeleteManyDto {
  @IsArray({ message: 'customerIds must be an array' })
  @ArrayNotEmpty({ message: 'customerIds cannot be empty' })
  @IsString({ each: true, message: 'Each customerId must be a string' })
  @IsNotEmpty({ each: true, message: 'customerId cannot be empty' })
  customerIds: string[];
}
