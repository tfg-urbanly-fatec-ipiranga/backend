import { Injectable } from "@nestjs/common";
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

  update(id: string, data: UpdateUserDto) {
    const { birthDate, ...rest } = data;
    return this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(birthDate && { birthDate: new Date(birthDate) }),
      },
      select: this.select,
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
