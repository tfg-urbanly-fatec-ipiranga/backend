import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber, IsBoolean } from "class-validator";

export class CreatePlaceDto {
  @ApiProperty({ example: "Café Central" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: "Um café aconchegante no centro" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: "Rua das Flores, 123" })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: "São Paulo" })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: "08:00" })
  @IsString()
  openingTime: string;

  @ApiProperty({ example: "22:00" })
  @IsString()
  closingTime: string;

  @ApiProperty({ example: -23.5505 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: -46.6333 })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: "uuid-da-categoria" })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class UpdatePlaceDto {
  @ApiPropertyOptional({ example: "Café Central Atualizado" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: "Descrição atualizada" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: "Rua Nova, 456" })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: "Rio de Janeiro" })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: "09:00" })
  @IsString()
  @IsOptional()
  openingTime?: string;

  @ApiPropertyOptional({ example: "23:00" })
  @IsString()
  @IsOptional()
  closingTime?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ example: "uuid-da-categoria" })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class FindPlacesByTagDto {
  @ApiProperty({ example: "pet-friendly" })
  @IsString()
  tag: string;
}

export class FullSearchDto {
  @ApiProperty({ example: "café" })
  @IsString()
  searchTerm: string;
}
