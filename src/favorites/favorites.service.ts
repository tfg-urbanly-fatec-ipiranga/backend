import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ToggleFavoriteDto } from "./favorites.dto";

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly select = {
    id: true,
    createdAt: true,
    place: {
      select: { id: true, name: true, city: true, category: { select: { name: true } } },
    },
  };

  async findByUser(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      select: this.select,
      orderBy: { createdAt: "desc" },
    });
  }

  async toggle(data: ToggleFavoriteDto) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_placeId: {
          userId: data.userId,
          placeId: data.placeId,
        },
      },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    await this.prisma.favorite.create({ data });
    return { favorited: true };
  }
}
