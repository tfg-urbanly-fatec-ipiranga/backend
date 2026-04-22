import { IsNotEmpty, IsString } from "class-validator";

export class ToggleFavoriteDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  placeId: string;
}
