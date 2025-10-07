import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateCompanyDto } from 'src/company/dto';
import { CreateUserDto } from 'src/user/dto';

export class SignupDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company: CreateCompanyDto;
}
