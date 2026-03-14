import { IsString, IsOptional } from "class-validator"

export class CreatePlaceDto {
    @IsString()
    name: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    openingTime: string

    @IsString()
    closingTime: string

    @IsString()
    federalTaxPayerId: string
}

export class UpdatePlaceDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    openingTime?: string

    @IsString()
    @IsOptional()
    closingTime?: string

}