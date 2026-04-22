import { Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { RequiredBody } from "src/common/decorators/required-body.decorator";
import { FavoritesService } from "./favorites.service";
import { ToggleFavoriteDto } from "./favorites.dto";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "@prisma/client";

@Controller({ version: "1", path: "favorites" })
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Get("user/:userId")
  findByUser(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.favoritesService.findByUser(userId);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  toggle(@RequiredBody() body: ToggleFavoriteDto) {
    return this.favoritesService.toggle(body);
  }
}
