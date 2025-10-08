import { IsNotEmpty, IsString } from 'class-validator';

export class StoreDto {
  @IsNotEmpty()
  @IsString()
  store_name: string;

  @IsNotEmpty()
  @IsString()
  store_location: string;
}
