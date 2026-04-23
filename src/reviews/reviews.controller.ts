import {
  Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredBody } from "src/common/decorators/required-body.decorator";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto, UpdateReviewDto } from "./reviews.dto";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "@prisma/client";

@ApiTags("Reviews")
@ApiBearerAuth()
@Controller({ version: "1", path: "reviews" })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Get("place/:placeId")
  @ApiOperation({ summary: "Listar avaliações de um lugar" })
  @ApiResponse({ status: 200, description: "Lista de avaliações" })
  findByPlace(@Param("placeId", ParseUUIDPipe) placeId: string) {
    return this.reviewsService.findByPlace(placeId);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(":id")
  @ApiOperation({ summary: "Buscar avaliação por ID" })
  @ApiResponse({ status: 200, description: "Avaliação encontrada" })
  @ApiResponse({ status: 404, description: "Avaliação não encontrada" })
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const review = await this.reviewsService.findById(id);
    if (!review) throw new NotFoundException("Avaliação não encontrada");
    return review;
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  @ApiOperation({ summary: "Criar avaliação" })
  @ApiResponse({ status: 201, description: "Avaliação criada" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(@RequiredBody() body: CreateReviewDto) {
    return this.reviewsService.create(body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put(":id")
  @ApiOperation({ summary: "Atualizar avaliação" })
  @ApiResponse({ status: 200, description: "Avaliação atualizada" })
  @ApiResponse({ status: 404, description: "Avaliação não encontrada" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @RequiredBody() body: UpdateReviewDto,
  ) {
    const review = await this.reviewsService.findById(id);
    if (!review) throw new NotFoundException("Avaliação não encontrada");
    return this.reviewsService.update(id, body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(":id")
  @ApiOperation({ summary: "Deletar avaliação" })
  @ApiResponse({ status: 200, description: "Avaliação deletada" })
  @ApiResponse({ status: 404, description: "Avaliação não encontrada" })
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const review = await this.reviewsService.findById(id);
    if (!review) throw new NotFoundException("Avaliação não encontrada");
    return this.reviewsService.delete(id);
  }
}
