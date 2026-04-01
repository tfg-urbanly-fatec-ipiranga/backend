import {
  Body, Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put, Query,
} from "@nestjs/common";
import { PlacesService } from "./places.service";
import { CreatePlaceDto, FindPlacesByTagDto, FullSearchDto, UpdatePlaceDto } from "./places.dto";
import { AddTagDto } from "src/tags/tags.dto";

@Controller({ version: "1", path: "places" })
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  create(@Body() body: CreatePlaceDto) {
    return this.placesService.create(body);
  }

  @Get()
  findAll() {
    return this.placesService.findAll();
  }

  @Get("findByTag")
  findByTag(@Query() query: FindPlacesByTagDto) {
    return this.placesService.findByTag(query);
  }

  @Get("search")
  search(@Query() query: FullSearchDto) {
    return this.placesService.fullSearch(query);
  }

  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const place = await this.placesService.findById(id);
    if (!place) throw new NotFoundException("Estabelecimento não encontrado");
    return place;
  }

  @Put(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdatePlaceDto,
  ) {
    const place = await this.placesService.findById(id);
    if (!place) throw new NotFoundException("Estabelecimento não encontrado");
    return this.placesService.update(id, body);
  }

  @Post(":id/tags")
  async addTagToPlace(
    @Param("id", ParseUUIDPipe) placeId: string,
    @Body() body: AddTagDto,
  ) {
    return this.placesService.addTag(placeId, body.tagName);
  }

  @Delete(":id/tags/:tagId")
  async removeTagFromPlace(
    @Param("id", ParseUUIDPipe) placeId: string,
    @Param("tagId", ParseUUIDPipe) tagId: string,
  ) {
    return this.placesService.removeTag(placeId, tagId);
  }

  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const place = await this.placesService.findById(id);
    if (!place) throw new NotFoundException("Estabelecimento não encontrado");
    return this.placesService.delete(id);
  }
}
