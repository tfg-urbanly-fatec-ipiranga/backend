import { Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { RequiredBody } from "src/common/decorators/required-body.decorator";
import { FavoritesService } from "./favorites.service";
import { ToggleFavoriteDto } from "./favorites.dto";

@Controller({ version: "1", path: "favorites" })
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get("user/:userId")
  findByUser(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.favoritesService.findByUser(userId);
  }

  @Post()
  toggle(@RequiredBody() body: ToggleFavoriteDto) {
    return this.favoritesService.toggle(body);
  }
}
