import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {
    constructor(private readonly prisma: PrismaService) { }
    async getOrCreateTag(name: string) {
        const normalized = name.trim().toLowerCase();
      
        return this.prisma.tag.upsert({
          where: { name: normalized },
          update: {},
          create: { name: normalized },
        });
      }
}
