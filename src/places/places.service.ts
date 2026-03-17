import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePlaceDto, FindPlacesByTagDto, UpdatePlaceDto } from "./places.dto";
import { TagsService } from "src/tags/tags.service";

@Injectable()
export class PlacesService {
  constructor(
    private prisma: PrismaService,
    private tagsService: TagsService,
  ) {}

  private select = {
    id: true,
    name: true,
    description: true,
    address: true,
    city: true,
    latitude: true,
    longitude: true,
    active: true,
    openingTime: true,
    closingTime: true,
    category: { select: { id: true, name: true } },
    placeTags: {
      include: { tag: { select: { name: true } } },
    },
  };

  async create(data: CreatePlaceDto) {
    return this.prisma.place.create({ data, select: this.select });
  }

  async findAll() {
    return this.prisma.place.findMany({
      where: { active: true },
      select: this.select,
    });
  }

  async findById(id: string) {
    return this.prisma.place.findUnique({
      where: { id },
      select: this.select,
    });
  }

  async findByTag(dto: FindPlacesByTagDto) {
    if (!dto.tag) {
      throw new BadRequestException("tag query param is required");
    }

    const tag = dto.tag.trim().toLowerCase();
    if (tag.length === 0) return [];

    return this.prisma.place.findMany({
      where: {
        active: true,
        placeTags: {
          some: {
            tag: { name: { equals: tag, mode: "insensitive" } },
          },
        },
      },
      select: this.select,
      orderBy: { name: "asc" },
    });
  }

  async update(id: string, data: UpdatePlaceDto) {
    return this.prisma.place.update({
      where: { id },
      data,
      select: this.select,
    });
  }

  async addTag(placeId: string, tagName: string) {
    const tag = await this.tagsService.getOrCreateTag(tagName);
    return this.prisma.placeTag.create({
      data: { placeId, tagId: tag.id },
    });
  }

  async removeTag(placeId: string, tagId: string) {
    return this.prisma.placeTag.delete({
      where: { placeId_tagId: { placeId, tagId } },
    });
  }

  async delete(id: string) {
    return this.prisma.place.delete({ where: { id } });
  }
}
