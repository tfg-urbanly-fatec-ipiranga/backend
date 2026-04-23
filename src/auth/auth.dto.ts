import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "João" })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Silva" })
  @IsString()
  lastName: string;

  @ApiProperty({ example: "joaosilva" })
  @IsString()
  username: string;

  @ApiProperty({ example: "joao@email.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "senha123", minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "1990-01-15" })
  @IsDateString()
  birthDate: string;
}

export class LoginDto {
  @ApiProperty({ example: "joao@email.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "senha123" })
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: "uuid-do-usuario" })
  @IsString()
  userId: string;

  @ApiProperty({ example: "senhaAtual123" })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: "novaSenha123", minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
