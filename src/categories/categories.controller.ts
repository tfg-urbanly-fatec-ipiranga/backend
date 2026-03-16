import {
  Body, Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./categories.dto";

@Controller({ version: "1", path: "categories" })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  @Post()
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Put(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Category not found");
    return this.categoriesService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Category not found");
    return this.categoriesService.delete(id);
  }
}
