import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateReviewDto, UpdateReviewDto } from "./reviews.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) { }

  private readonly select = {
    id: true,
    rating: true,
    comment: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
    active: true,
    user: { select: { id: true, firstName: true, lastName: true } },
    place: { select: { id: true, name: true } },
  };

  async findByPlace(placeId: string) {
    return this.prisma.review.findMany({
      where: { placeId, deletedAt: null, active: true },
      select: this.select,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return this.prisma.review.findFirst({
      where: { id, deletedAt: null },
      select: this.select,
    });
  }

  async create(data: CreateReviewDto) {
    const existing = await this.prisma.review.findFirst({
      where: {
        userId: data.userId,
        placeId: data.placeId,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException(
        "Usuário já avaliou este estabelecimento. Use PUT para atualizar.",
      );
    }

    return this.prisma.review.create({
      data: { ...data, active: false },
      select: this.select,
    });
  }

  async update(id: string, data: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data,
      select: this.select,
    });
  }

  async delete(id: string) {
    return this.prisma.review.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: this.select,
    });
  }

  async findPending() {
    return this.prisma.review.findMany({
      where: { active: false },
      select: this.select,
      orderBy: { createdAt: "desc" },
    });
  }

  async approve(id: string) {
    return this.prisma.review.update({
      where: { id },
      data: { active: true },
      select: this.select,
    });
  }

  async reject(id: string) {
    return this.prisma.review.delete({ where: { id } });
  }
}
