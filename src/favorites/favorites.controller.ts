import { Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredBody } from "src/common/decorators/required-body.decorator";
import { FavoritesService } from "./favorites.service";
import { ToggleFavoriteDto } from "./favorites.dto";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "@prisma/client";

@ApiTags("Favorites")
@ApiBearerAuth()
@Controller({ version: "1", path: "favorites" })
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Get("user/:userId")
  @ApiOperation({ summary: "Listar favoritos de um usuário" })
  @ApiResponse({ status: 200, description: "Lista de favoritos" })
  findByUser(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.favoritesService.findByUser(userId);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  @ApiOperation({ summary: "Adicionar ou remover favorito" })
  @ApiResponse({ status: 201, description: "Favorito alternado" })
  toggle(@RequiredBody() body: ToggleFavoriteDto) {
    return this.favoritesService.toggle(body);
  }
}
