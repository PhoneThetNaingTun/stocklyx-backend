import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class BrandDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  brand_name: string;
}
