import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService,PrismaService]
})
export class PlacesModule {}
