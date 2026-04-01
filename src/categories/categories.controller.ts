import {
  Body, Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./categories.dto";
import { Public } from "src/auth/public.decorator";
import { Roles } from "src/auth/roles.decorator";

@Controller({ version: "1", path: "categories" })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Categoria não encontrada");
    return category;
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Roles(Role.ADMIN)
  @Put(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Categoria não encontrada");
    return this.categoriesService.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Categoria não encontrada");
    return this.categoriesService.delete(id);
  }
}
