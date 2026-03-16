import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
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
  toggle(@Body() body: ToggleFavoriteDto) {
    return this.favoritesService.toggle(body);
  }
}
