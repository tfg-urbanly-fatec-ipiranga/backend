import { Module } from "@nestjs/common";
import { PlacePhotosController } from "./place-photos.controller";
import { PlacePhotosService } from "./place-photos.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/common/services/cloudinary/cloudinary.service";

@Module({
  controllers: [PlacePhotosController],
  providers: [PlacePhotosService, PrismaService, CloudinaryService],
})
export class PlacePhotosModule {}
