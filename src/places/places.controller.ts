import {
  Controller, Delete, Get, NotFoundException, Patch,
  Param, ParseUUIDPipe, Post, Put, Query,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { PlacesService } from "./places.service";
import { CreatePlaceDto, FindPlacesByTagDto, FullSearchDto, UpdatePlaceDto } from "./places.dto";
import { AddTagDto } from "src/tags/tags.dto";
import { Public } from "src/auth/public.decorator";
import { Roles } from "src/auth/roles.decorator";
import { RequiredBody } from "src/common/decorators/required-body.decorator";

@Controller({ version: "1", path: "places" })
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@RequiredBody() body: CreatePlaceDto) {
    return this.placesService.create(body);
  }

  @Public()
  @Get()
  findAll() {
    return this.placesService.findAll();
  }

  @Public()
  @Get("findByTag")
  findByTag(@Query() query: FindPlacesByTagDto) {
    return this.placesService.findByTag(query);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get("search")
  search(@Query() query: FullSearchDto) {
    return this.placesService.fullSearch(query);
  }

  @Roles(Role.ADMIN)
  @Get("inactive")
  findInactive() {
    return this.placesService.findInactive();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const place = await this.placesService.findById(id);
    if (!place) throw new NotFoundException("Place not found");
    return place;
  }

  @Roles(Role.ADMIN)
  @Put(":id")
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
  async addTagToPlace(
    @Param("id", ParseUUIDPipe) placeId: string,
    @RequiredBody() body: AddTagDto,
  ) {
    return this.placesService.addTag(placeId, body.tagName);
  }

  @Roles(Role.ADMIN)
  @Delete(":id/tags/:tagId")
  async removeTagFromPlace(
    @Param("id", ParseUUIDPipe) placeId: string,
    @Param("tagId", ParseUUIDPipe) tagId: string,
  ) {
    return this.placesService.removeTag(placeId, tagId);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const place = await this.placesService.findById(id);
    if (!place) throw new NotFoundException("Place not found");
    return this.placesService.delete(id);
  }

  @Roles(Role.ADMIN)
  @Patch(":id/restore")
  async restore(@Param("id", ParseUUIDPipe) id: string) {
    return this.placesService.restore(id);
  }
}
