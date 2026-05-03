import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TagsService } from 'src/tags/tags.service';
import { EmbeddingsService } from 'src/embeddings/embeddings.service';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, PrismaService, TagsService, EmbeddingsService]
})
export class PlacesModule { }
