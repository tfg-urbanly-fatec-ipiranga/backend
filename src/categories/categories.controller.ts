import {
  Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./categories.dto";
import { Roles } from "src/auth/roles.decorator";
import { RequiredBody } from "src/common/decorators/required-body.decorator";

@ApiTags("Categories")
@ApiBearerAuth()
@Controller({ version: "1", path: "categories" })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  @ApiOperation({ summary: "Listar todas as categorias" })
  @ApiResponse({ status: 200, description: "Lista de categorias" })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(":id")
  @ApiOperation({ summary: "Buscar categoria por ID" })
  @ApiResponse({ status: 200, description: "Categoria encontrada" })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Categoria não encontrada");
    return category;
  }

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: "Criar nova categoria" })
  @ApiResponse({ status: 201, description: "Categoria criada" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(@RequiredBody() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Roles(Role.ADMIN)
  @Put(":id")
  @ApiOperation({ summary: "Atualizar categoria" })
  @ApiResponse({ status: 200, description: "Categoria atualizada" })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @RequiredBody() body: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Categoria não encontrada");
    return this.categoriesService.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  @ApiOperation({ summary: "Deletar categoria" })
  @ApiResponse({ status: 200, description: "Categoria deletada" })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException("Categoria não encontrada");
    return this.categoriesService.delete(id);
  }
}
