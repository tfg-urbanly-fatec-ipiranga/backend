import {
  Body, Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put,
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto, UpdateReviewDto } from "./reviews.dto";

@Controller({ version: "1", path: "reviews" })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get("place/:placeId")
  findByPlace(@Param("placeId", ParseUUIDPipe) placeId: string) {
    return this.reviewsService.findByPlace(placeId);
  }

  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const review = await this.reviewsService.findById(id);
    if (!review) throw new NotFoundException("Review not found");
    return review;
  }

  @Post()
  create(@Body() body: CreateReviewDto) {
    return this.reviewsService.create(body);
  }

  @Put(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateReviewDto,
  ) {
    const review = await this.reviewsService.findById(id);
    if (!review) throw new NotFoundException("Review not found");
    return this.reviewsService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const review = await this.reviewsService.findById(id);
    if (!review) throw new NotFoundException("Review not found");
    return this.reviewsService.delete(id);
  }
}
