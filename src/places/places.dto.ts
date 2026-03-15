import { IsString, IsOptional, IsNumber } from "class-validator"

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

    @IsNumber()
    latitude: number

    @IsNumber()
    longitude: number
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


export class FindPlacesByTagDto {
    @IsString()
    tag: string
}
