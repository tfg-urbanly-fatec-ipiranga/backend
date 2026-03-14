import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PlacesModule } from './places/places.module';
import { CloudinaryService } from './common/services/cloudinary/cloudinary.service';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [UsersModule, PlacesModule, TagsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, CloudinaryService],
})
export class AppModule {}
