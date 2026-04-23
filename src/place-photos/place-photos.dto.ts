import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreatePlacePhotoDto {
  @ApiProperty({ example: "uuid-do-lugar" })
  @IsString()
  placeId: string;

  @ApiPropertyOptional({ example: "Fachada do estabelecimento" })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class UpdatePlacePhotoDto {
  @ApiPropertyOptional({ example: "Legenda atualizada" })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
