import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
