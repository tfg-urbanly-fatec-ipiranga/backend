import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ToggleFavoriteDto {
  @ApiProperty({ example: "uuid-do-usuario" })
  @IsString()
  userId: string;

  @ApiProperty({ example: "uuid-do-lugar" })
  @IsString()
  placeId: string;
}
