import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CustomerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  customer_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @IsEmail()
  customer_email: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  customer_phone: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  customer_address: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  customer_city: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  customer_country: string;
}
