import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';


export class CreatePlacePhotoDto {
  @IsString()
  placeId: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @Transform(({ value }) => value === 'true' || value === "true" || value === true)
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class UpdatePlacePhotoDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @Transform(({ value }) => value === 'true' || value === "true" || value === true)
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
