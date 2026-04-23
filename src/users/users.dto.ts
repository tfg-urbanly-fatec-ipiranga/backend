import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "João" })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: "Silva" })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: "joaosilva" })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: "joao@email.com" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: "https://example.com/avatar.jpg" })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: "1990-01-15" })
  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
