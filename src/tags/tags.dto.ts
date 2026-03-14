import { IsString } from "class-validator";

export class AddTagDto {
  @IsString()
  tagName: string;
}