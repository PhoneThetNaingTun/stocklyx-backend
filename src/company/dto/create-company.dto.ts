import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  company_name: string;
}
