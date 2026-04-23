import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Restaurante" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: "#FF5733" })
  @IsString()
  @IsOptional()
  iconColor?: string;

  @ApiPropertyOptional({ example: "Estabelecimentos de alimentação" })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: "Restaurante Atualizado" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: "#00FF00" })
  @IsString()
  @IsOptional()
  iconColor?: string;

  @ApiPropertyOptional({ example: "Descrição atualizada" })
  @IsString()
  @IsOptional()
  description?: string;
}
