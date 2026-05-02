import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePlaceDto, FindPlacesByTagDto, FullSearchDto, UpdatePlaceDto } from "./places.dto";
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
      throw new BadRequestException("Tag parameter is required");
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

  async fullSearch(dto: FullSearchDto) {
    const ids = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT DISTINCT p."id"
      FROM "Place" p
      INNER JOIN "PlaceTag" pt ON p."id" = pt."placeId"
      INNER JOIN "Tag" t ON pt."tagId" = t."id"
      WHERE p."name" % ${dto.searchTerm} 
      OR t."name" % ${dto.searchTerm}
    `;

    if (!ids || ids.length === 0) {
      throw new NotFoundException("No place found");
    }
    return this.prisma.place.findMany({
      where: {
        id: { in: ids.map(i => i.id) }
      },
      include: {
        category: true,
        placeTags: {
          include: { tag: true }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    }).then(places =>
      places.map(p => {
        const ratings = p.reviews.map(r => r.rating);

        const avg =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : null;

        return {
          ...p,
          avgRating: avg,
        };
      })
    );
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
