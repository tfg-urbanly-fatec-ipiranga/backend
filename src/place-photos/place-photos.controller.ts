import {
  Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put, UploadedFile, UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredBody } from "src/common/decorators/required-body.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "@prisma/client";
import { PlacePhotosService } from "./place-photos.service";
import { CreatePlacePhotoDto, UpdatePlacePhotoDto } from "./place-photos.dto";
import { Roles } from "src/auth/roles.decorator";

@ApiTags("Place Photos")
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller({ version: "1", path: "place-photos" })
export class PlacePhotosController {
  constructor(private readonly placePhotosService: PlacePhotosService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Get("place/:placeId")
  @ApiOperation({ summary: "Listar fotos de um lugar" })
  @ApiResponse({ status: 200, description: "Lista de fotos" })
  findByPlace(@Param("placeId", ParseUUIDPipe) placeId: string) {
    return this.placePhotosService.findByPlace(placeId);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(":id")
  @ApiOperation({ summary: "Buscar foto por ID" })
  @ApiResponse({ status: 200, description: "Foto encontrada" })
  @ApiResponse({ status: 404, description: "Foto não encontrada" })
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const photo = await this.placePhotosService.findById(id);
    if (!photo) throw new NotFoundException("Foto não encontrada");
    return photo;
  }

  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload de foto de lugar" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Foto enviada" })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @RequiredBody() body: CreatePlacePhotoDto,
  ) {
    return this.placePhotosService.upload(
      file,
      body.placeId,
      body.caption,
      body.isPrimary,
    );
  }

  @Roles(Role.ADMIN)
  @Put(":id")
  @ApiOperation({ summary: "Atualizar foto" })
  @ApiResponse({ status: 200, description: "Foto atualizada" })
  @ApiResponse({ status: 404, description: "Foto não encontrada" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @RequiredBody() body: UpdatePlacePhotoDto,
  ) {
    const photo = await this.placePhotosService.findById(id);
    if (!photo) throw new NotFoundException("Foto não encontrada");
    return this.placePhotosService.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  @ApiOperation({ summary: "Deletar foto" })
  @ApiResponse({ status: 200, description: "Foto deletada" })
  @ApiResponse({ status: 404, description: "Foto não encontrada" })
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const photo = await this.placePhotosService.findById(id);
    if (!photo) throw new NotFoundException("Foto não encontrada");
    return this.placePhotosService.delete(id);
  }
}
