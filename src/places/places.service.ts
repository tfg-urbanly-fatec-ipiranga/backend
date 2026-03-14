import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaceDto, UpdatePlaceDto } from './places.dto';

@Injectable()
export class PlacesService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreatePlaceDto) {
        return this.prisma.place.create({ data })
    }

    async findAll() {
        return this.prisma.place.findMany()
    }

    async findById(id: string) {
        return this.prisma.place.findUnique({ where: { id } })
    }

    async update(id: string, data: UpdatePlaceDto) {
        return this.prisma.place.update({ where: { id }, data })
    }

    async delete(id: string) {
        return this.prisma.place.delete({ where: { id } })
    }
}
