import {
  Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put,
} from "@nestjs/common";
import { RequiredBody } from "src/common/decorators/required-body.decorator";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto, UpdateReviewDto } from "./reviews.dto";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "@prisma/client";

@Controller({ version: "1", path: "reviews" })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  
  @Roles(Role.ADMIN)
  @Get("pending")
  findPending() {
    return this.reviewsService.findPending();
  }
  
  @Roles(Role.ADMIN)
  @Post("approve/:id")
  async approve(@Param("id", ParseUUIDPipe) id: string) {
    const review = await this.reviewsService.findById(id);
    if (!review) throw new NotFoundException("Review Not Found");
    return this.reviewsService.approve(id);
  } 
  
  @Roles(Role.ADMIN)
  @Post("reject/:id")
  async reject(@Param("id", ParseUUIDPipe) id: string) {
    const review = await this.reviewsService.findById(id);
    if (!review) throw new NotFoundException("Review Not Found");
    return this.reviewsService.reject(id);
  }
  
  @Roles(Role.ADMIN, Role.USER)
  @Get("place/:placeId")
  findByPlace(@Param("placeId", ParseUUIDPipe) placeId: string) {
    return this.reviewsService.findByPlace(placeId);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const review = await this.reviewsService.findById(id);
    if (!review) throw new NotFoundException("Avaliação não encontrada");
    return review;
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  create(@RequiredBody() body: CreateReviewDto) {
    return this.reviewsService.create(body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put(":id")
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
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const review = await this.reviewsService.findById(id);
    if (!review) throw new NotFoundException("Review Not Found");
    return this.reviewsService.delete(id);
  }

}
