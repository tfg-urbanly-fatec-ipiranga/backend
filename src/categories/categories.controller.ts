import {
  Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./categories.dto";
import { Roles } from "src/auth/roles.decorator";
import { RequiredBody } from "src/common/decorators/required-body.decorator";

@Controller({ version: "1", path: "categories" })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@RequiredBody() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Roles(Role.ADMIN)
  @Put(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @RequiredBody() body: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Category not found");
    return this.categoriesService.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Category not found");
    return this.categoriesService.delete(id);
  }
}
