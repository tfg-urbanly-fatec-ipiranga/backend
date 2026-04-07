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
    createdAt: true,
    updatedAt: true,
  };

  findAll() {
    return this.prisma.user.findMany({ select: this.select });
  }

  findById(id: string) {
    return this.prisma.user.findFirst({
      where: { id },
      select: this.select,
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
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
        e.code === 'P2002'
      ) {
        const field = (e.meta?.target as string[])?.[0] ?? 'field';
        throw new ConflictException(`${field} already in use`);
      }
      throw e;
    }
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
