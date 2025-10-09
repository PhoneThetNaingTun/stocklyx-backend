import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  category_name: string;
}
