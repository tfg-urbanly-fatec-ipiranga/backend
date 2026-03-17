import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreatePlacePhotoDto {
  @IsString()
  placeId: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class UpdatePlacePhotoDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
