import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto, UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	private readonly select = {
		id: true,
		firstName: true,
		lastName: true,
		userName: true,
		email: true,
		role: true,
		birthDate: true,
		createdAt: true,
		updatedAt: true,
	}

	findAll() {
		return this.prisma.user.findMany({
			select: this.select
		});
	}

	findById(id: string) {
		return this.prisma.user.findFirst({
			where: {
				id,
			},
			select: this.select
		});
	}

	findByUserName(userName: string) {
		return this.prisma.user.findUnique({
			where: {
				userName,
			},
			select: this.select
		});
	}

	findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			},
			select: this.select
		});
	}

	create(data: CreateUserDto) {
		return this.prisma.user.create({
			data
		});
	}

	update(id: string, data: UpdateUserDto) {
		return this.prisma.user.update({
			where: {
				id
			},
			data,
			select: this.select
		});
	}

	delete(id: string) {
		return this.prisma.user.delete({
			where: {
				id
			}
		});
	}
}
