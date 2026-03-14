import { Role } from "@prisma/client";
import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  firstName: string
  @IsString()
  @IsEmail()
  email: string
  @IsString()
  password: string
  @IsString()
  lastName: string
  @IsString()
  userName: string
  @IsDate()
  @IsOptional()
  birthDate?: Date
  @IsEnum(Role)
  role?: Role = Role.USER
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string
  @IsString()
  @IsOptional()
  lastName?: string
  @IsDate()
  @IsOptional()
  birthDate?: Date

  @IsString()
  @IsOptional()
  avatar?: string
}
