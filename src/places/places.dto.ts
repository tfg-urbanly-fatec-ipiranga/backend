import { IsString, IsOptional, IsNumber, IsBoolean } from "class-validator";

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  openingTime: string;

  @IsString()
  closingTime: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  embedding?: number[];

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdatePlaceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  openingTime?: string;

  @IsString()
  @IsOptional()
  closingTime?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsOptional()
  embedding?: number[];
}

export class FindPlacesByTagDto {
  @IsString()
  tag: string;
}

export class FullSearchDto {
  @IsString()
  searchTerm: string;
}
