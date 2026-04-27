import { ConflictException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly select = {
    id: true,
    firstName: true,
    lastName: true,
    username: true,
    email: true,
    role: true,
    avatar: true,
    birthDate: true,
    active: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
  };

  findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: this.select,
    });
  }

  findById(id: string) {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: this.select,
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      select: this.select,
    });
  }

  async update(id: string, data: UpdateUserDto) {
    const { birthDate, ...rest } = data;
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...rest,
          ...(birthDate && { birthDate: new Date(birthDate) }),
        },
        select: this.select,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        const field = (e.meta?.target as string[])?.[0] ?? "field";
        throw new ConflictException(`${field} already in use`);
      }
      throw e;
    }
  }

  delete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { active: false, deletedAt: new Date() },
      select: this.select,
    });
  }

  findInactive() {
    return this.prisma.user.findMany({
      where: { deletedAt: { not: null } },
      select: this.select,
    });
  }

  restore(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { active: true, deletedAt: null },
      select: this.select,
    });
  }
}
