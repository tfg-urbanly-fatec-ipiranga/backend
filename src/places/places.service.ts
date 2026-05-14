import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  PrismaService,
} from "src/prisma/prisma.service";
import {
  CreatePlaceDto,
  FindPlacesByTagDto,
  FullSearchDto,
  UpdatePlaceDto,
} from "./places.dto";
import { TagsService } from "src/tags/tags.service";
import { EmbeddingsService } from "src/embeddings/embeddings.service";

@Injectable()
export class PlacesService {
  constructor(
    private prisma: PrismaService,
    private tagsService: TagsService,
    private readonly embeddingsService: EmbeddingsService,
  ) { }

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
    workingDays: true,
    priceLevel: true,
    category: { select: { id: true, name: true } },
    placeTags: {
      include: { tag: { select: { name: true } } },
    },
      photos: { select: {
        id: true,
        url: true,
        isPrimary: true,
      },
    },
  }

  async create(data: CreatePlaceDto) {

    const { tags = [], ...placeData } = data;
    const place = await this.prisma.place.create({
      data: placeData,
      select: this.select
    })

    const tagPromises = tags.map(async (tagName) => {
      await this.addTag(place.id, tagName)
      return tagName
    })

    await Promise.all(tagPromises)

    const updatedPlace = await this.prisma.place.findUnique({
      where: { id: place.id },
      include: {
        placeTags: {
          include: {
            tag: true
          }
        },
        category: true
      }
    })

    if (!updatedPlace) {
      throw new NotFoundException('Error returning place to generate embedding.');
    }

    const placeName = updatedPlace.name;
    const placeDescription = updatedPlace.description ?? '';
    const placeCategory = updatedPlace.category?.name ?? 'Geral';
    const placeTags = updatedPlace.placeTags.map(pt => pt.tag.name);

    let embedding: number[] | null = null;

    try {
      embedding = await this.embeddingsService.generateEmbeddings({
        placeName,
        placeCategory,
        placeTags,
        placeDescription
      });
    } catch (error) {
      console.error(error);
    }

    if (embedding && embedding.length > 0) {
      const vectorString = `[${embedding.join(',')}]`;

      await this.prisma.$executeRaw`
    UPDATE "Place" 
    SET "embedding" = ${vectorString}::vector 
    WHERE id = ${place.id}
  `;
    }

    const finalPlace = await this.prisma.place.findUnique({
      where: { id: place.id },
      include: {
        placeTags: { include: { tag: true } },
        category: true
      }
    })

    return finalPlace;
  }

  async findAll() {
    const places = await this.prisma.place.findMany({
      where: { active: true, deletedAt: null },
      include: {
        category: true,
        placeTags: {
          include: {
            tag: {
              select: {
                name: true
              }
            }
          }
        },
        photos: {
          select: {
            id: true,
            url: true,
            isPrimary: true,
          }
        },
        reviews: {
          where: {
            active: true
          },
          select: {
            rating: true
          }
        }
      },
    });

    return places.map(p => {
      const ratings = p.reviews.map(r => r.rating);

      const avg =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : null;

      return {
        ...p,
        avgRating: avg,
      };
    });
  }

  async findById(id: string) {
    return this.prisma.place.findFirst({
      where: { id, deletedAt: null },
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
        deletedAt: null,
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
        id: { in: ids.map(i => i.id) },
        active: true,
        deletedAt: null,
      },
      include: {
        category: true,
        placeTags: {
          include: { tag: true }
        },
        reviews: {
          where: {
            active: true
          },
          select: {
            rating: true
          }
        },
        photos: {
          select: {
            id: true,
            url: true,
            isPrimary: true,
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

  async findByVibe(query: string) {
    // 1. Transforma a busca do usuário em um vetor de "vibe"
    const queryVector = await this.embeddingsService.generateSearchEmbedding(query);
    const vectorString = `[${queryVector.join(',')}]`;

    // 2. Busca no banco apenas os IDs e a Distância, ordenados pelo pgvector
    // Usamos o operador <=> (Similaridade de Cosseno)
    const rankedResults = await this.prisma.$queryRaw<any[]>`
    SELECT 
      id, 
      (embedding <=> ${vectorString}::vector) as distance
    FROM "Place"
    WHERE active = true
    ORDER BY distance ASC
    LIMIT 10;
  `;

    // Se a IA não encontrar nada, retornamos vazio para evitar erros no map
    if (rankedResults.length === 0) return [];

    const idsOrdenados = rankedResults.map(r => r.id);

    // 3. Busca os dados completos dos locais que a IA selecionou
    const places = await this.prisma.place.findMany({
      where: {
        id: { in: idsOrdenados }
      },
      include: {
        category: true,
        placeTags: {
          include: { tag: true }
        },
        reviews: {
          where: {
            active: true
          },
          select: {
            rating: true
          }
        }
      }
    });

    return idsOrdenados.map(id => {
      const p = places.find(place => place.id === id);

      if (!p) return null;

      const ratings = p.reviews.map(r => r.rating);

      const avg =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : null;

      const distance = rankedResults.find(r => r.id === id)?.distance;

      return {
        ...p,
        avgRating: avg,
        score: distance ? (1 - distance).toFixed(4) : null,
      };
    }).filter(p => p !== null);
  }

  async update(id: string, data: UpdatePlaceDto) {
    const { tags, ...updateData } = data;
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
    return this.prisma.place.update({
      where: { id },
      data: { active: false, deletedAt: new Date() },
      select: this.select,
    });
  }

  findInactive() {
    return this.prisma.place.findMany({
      where: { deletedAt: { not: null } },
      select: this.select,
    });
  }

  restore(id: string) {
    return this.prisma.place.update({
      where: { id },
      data: { active: true, deletedAt: null },
      select: this.select,
    });
  }
}
