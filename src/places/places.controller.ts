import {
  Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put, Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { PlacesService } from "./places.service";
import { CreatePlaceDto, FindPlacesByTagDto, FullSearchDto, UpdatePlaceDto } from "./places.dto";
import { AddTagDto } from "src/tags/tags.dto";
import { Public } from "src/auth/public.decorator";
import { Roles } from "src/auth/roles.decorator";
import { RequiredBody } from "src/common/decorators/required-body.decorator";

@ApiTags("Places")
@ApiBearerAuth()
@Controller({ version: "1", path: "places" })
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: "Criar novo lugar" })
  @ApiResponse({ status: 201, description: "Lugar criado" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(@RequiredBody() body: CreatePlaceDto) {
    return this.placesService.create(body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  @ApiOperation({ summary: "Listar todos os lugares" })
  @ApiResponse({ status: 200, description: "Lista de lugares" })
  findAll() {
    return this.placesService.findAll();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get("findByTag")
  @ApiOperation({ summary: "Buscar lugares por tag" })
  @ApiResponse({ status: 200, description: "Lugares encontrados" })
  findByTag(@Query() query: FindPlacesByTagDto) {
    return this.placesService.findByTag(query);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get("search")
  @ApiOperation({ summary: "Busca textual de lugares" })
  @ApiResponse({ status: 200, description: "Resultados da busca" })
  search(@Query() query: FullSearchDto) {
    return this.placesService.fullSearch(query);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(":id")
  @ApiOperation({ summary: "Buscar lugar por ID" })
  @ApiResponse({ status: 200, description: "Lugar encontrado" })
  @ApiResponse({ status: 404, description: "Lugar não encontrado" })
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const place = await this.placesService.findById(id);
    if (!place) throw new NotFoundException("Place not found");
    return place;
  }

  @Roles(Role.ADMIN)
  @Put(":id")
  @ApiOperation({ summary: "Atualizar lugar" })
  @ApiResponse({ status: 200, description: "Lugar atualizado" })
  @ApiResponse({ status: 404, description: "Lugar não encontrado" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @RequiredBody() body: UpdatePlaceDto,
  ) {
    const place = await this.placesService.findById(id);
    if (!place) throw new NotFoundException("Place not found");
    return this.placesService.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Post(":id/tags")
  @ApiOperation({ summary: "Adicionar tag a um lugar" })
  @ApiResponse({ status: 201, description: "Tag adicionada" })
  async addTagToPlace(
    @Param("id", ParseUUIDPipe) placeId: string,
    @RequiredBody() body: AddTagDto,
  ) {
    return this.placesService.addTag(placeId, body.tagName);
  }

  @Roles(Role.ADMIN)
  @Delete(":id/tags/:tagId")
  @ApiOperation({ summary: "Remover tag de um lugar" })
  @ApiResponse({ status: 200, description: "Tag removida" })
  async removeTagFromPlace(
    @Param("id", ParseUUIDPipe) placeId: string,
    @Param("tagId", ParseUUIDPipe) tagId: string,
  ) {
    return this.placesService.removeTag(placeId, tagId);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  @ApiOperation({ summary: "Deletar lugar" })
  @ApiResponse({ status: 200, description: "Lugar deletado" })
  @ApiResponse({ status: 404, description: "Lugar não encontrado" })
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const place = await this.placesService.findById(id);
    if (!place) throw new NotFoundException("Place not found");
    return this.placesService.delete(id);
  }
}
