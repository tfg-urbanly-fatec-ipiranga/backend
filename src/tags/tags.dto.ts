import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddTagDto {
  @ApiProperty({ example: "pet-friendly" })
  @IsString()
  tagName: string;
}
