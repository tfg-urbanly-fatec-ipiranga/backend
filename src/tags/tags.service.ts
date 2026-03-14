import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {
    constructor(private readonly prisma: PrismaService) { }
    async getOrCreateTag(name: string) {
        return await this.prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
}
