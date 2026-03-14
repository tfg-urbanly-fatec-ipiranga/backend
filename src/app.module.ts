import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PlacesModule } from './places/places.module';

@Module({
  imports: [UsersModule, PlacesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
