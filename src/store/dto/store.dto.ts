import { IsNotEmpty, IsString } from 'class-validator';

export class StoreDto {
  @IsNotEmpty()
  @IsString()
  store_name: string;

  @IsNotEmpty()
  @IsString()
  store_location: string;

  @IsNotEmpty()
  @IsString()
  store_phone: string;

  @IsNotEmpty()
  @IsString()
  store_email: string;

  @IsNotEmpty()
  @IsString()
  store_city: string;

  @IsNotEmpty()
  @IsString()
  store_country: string;
}
