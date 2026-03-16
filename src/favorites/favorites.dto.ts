import { IsString } from "class-validator";

export class ToggleFavoriteDto {
  @IsString()
  userId: string;

  @IsString()
  placeId: string;
}
