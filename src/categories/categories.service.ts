import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./categories.dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  }

  findById(id: string) {
    return this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
  }

  create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data });
  }

  update(id: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.category.update({
      where: { id },
      data: { active: false, deletedAt: new Date() },
    });
  }

  findInactive() {
    return this.prisma.category.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { name: "asc" },
    });
  }

  restore(id: string) {
    return this.prisma.category.update({
      where: { id },
      data: { active: true, deletedAt: null },
    });
  }
}
