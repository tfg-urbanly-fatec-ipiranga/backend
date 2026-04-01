import {
  Body, Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put, UploadedFile, UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PlacePhotosService } from "./place-photos.service";
import { CreatePlacePhotoDto, UpdatePlacePhotoDto } from "./place-photos.dto";

@Controller({ version: "1", path: "place-photos" })
export class PlacePhotosController {
  constructor(private readonly placePhotosService: PlacePhotosService) {}

  @Get("place/:placeId")
  findByPlace(@Param("placeId", ParseUUIDPipe) placeId: string) {
    return this.placePhotosService.findByPlace(placeId);
  }

  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const photo = await this.placePhotosService.findById(id);
    if (!photo) throw new NotFoundException("Foto não encontrada");
    return photo;
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreatePlacePhotoDto,
  ) {
    return this.placePhotosService.upload(
      file,
      body.placeId,
      body.caption,
      body.isPrimary,
    );
  }

  @Put(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdatePlacePhotoDto,
  ) {
    const photo = await this.placePhotosService.findById(id);
    if (!photo) throw new NotFoundException("Foto não encontrada");
    return this.placePhotosService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const photo = await this.placePhotosService.findById(id);
    if (!photo) throw new NotFoundException("Foto não encontrada");
    return this.placePhotosService.delete(id);
  }
}
