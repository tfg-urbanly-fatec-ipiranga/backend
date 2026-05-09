import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/common/services/cloudinary/cloudinary.service";
import { UpdatePlacePhotoDto } from "./place-photos.dto";

@Injectable()
export class PlacePhotosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findByPlace(placeId: string) {
    return this.prisma.placePhoto.findMany({
      where: { placeId, deletedAt: null },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    });
  }

  async findById(id: string) {
    return this.prisma.placePhoto.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async upload(
    file: Express.Multer.File,
    placeId: string,
    caption?: string,
    isPrimary?: boolean,
  ) {
    const photoId = crypto.randomUUID();
    const result = await this.cloudinary.upload(
      file,
      `places/${placeId}/${photoId}`,
    );

    return this.prisma.placePhoto.create({
      data: {
        placeId,
        url: result.url,
        caption,
        isPrimary: isPrimary ?? false,
      },
    });
  }

async update(id: string, data: UpdatePlacePhotoDto) {

  // busca foto atual
  const currentPhoto = await this.prisma.placePhoto.findUnique({
    where: { id },
  });

  if (!currentPhoto) {
    throw new NotFoundException('Photo not found');
  }

  // se virou primária
  if (data.isPrimary === true) {

    // remove primary das outras
    await this.prisma.placePhoto.updateMany({
      where: {
        placeId: currentPhoto.placeId,
        NOT: {
          id,
        },
      },
      data: {
        isPrimary: false,
      },
    });
  }
  // atualiza a foto atual
  return this.prisma.placePhoto.update({
    where: { id },
    data,
  });
}

  async delete(id: string) {
    return this.prisma.placePhoto.update({
      where: { id },
      data: { active: false, deletedAt: new Date() },
    });
  }
}
