import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [EmbeddingsService, PrismaService]
})
export class EmbeddingsModule {}
