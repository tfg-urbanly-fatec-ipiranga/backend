import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
  @ApiProperty({ example: "uuid-do-usuario" })
  @IsString()
  userId: string;

  @ApiProperty({ example: "uuid-do-lugar" })
  @IsString()
  placeId: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: "Ótimo lugar, recomendo!" })
  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateReviewDto {
  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ example: "Comentário atualizado" })
  @IsString()
  @IsOptional()
  comment?: string;
}
