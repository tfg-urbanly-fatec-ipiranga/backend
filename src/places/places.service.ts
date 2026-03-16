import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaceDto, FindPlacesByTagDto, UpdatePlaceDto } from './places.dto';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class PlacesService {
    constructor(
        private prisma: PrismaService,
        private tagsService: TagsService
    ) { }

    private select = {
        id: true,
        name: true,
        description: true,
        latitude: true,
        longitude: true,
        placeTags: {
            include: {
                tag: {
                    select: {
                        name: true
                    }
                }
            }
        }
    }

    async create(data: CreatePlaceDto) {
        return this.prisma.place.create({ data })
    }

    async findAll() {
        return this.prisma.place.findMany()
    }

    async findById(id: string) {
        return this.prisma.place.findUnique({
            where: { id },
            select: this.select,
        })
    }

    async findByTag(dto: FindPlacesByTagDto) {
        if (!dto.tag) {
            throw new BadRequestException('tag query param is required');
        }

        const tag = dto.tag.trim().toLowerCase();

        if (tag.length === 0) {
            return [];
        }

        return this.prisma.place.findMany({
            where: {
                placeTags: {
                    some: {
                        tag: {
                            name: { equals: tag, mode: 'insensitive' }
                        }
                    }
                }
            },
            select: this.select,
            orderBy: { name: 'asc' }
        });
    }

    async update(id: string, data: UpdatePlaceDto) {
        return this.prisma.place.update({ where: { id }, data })
    }

    async addTag(placeId: string, tagName: string) {
        const tag = await this.tagsService.getOrCreateTag(tagName);

        return this.prisma.placeTag.create({
            data: {
                placeId,
                tagId: tag.id
            }
        });
    }

    async delete(id: string) {
        return this.prisma.place.delete({ where: { id } })
    }
}
