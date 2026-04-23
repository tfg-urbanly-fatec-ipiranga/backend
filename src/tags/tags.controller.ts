import { Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredBody } from "src/common/decorators/required-body.decorator";
import { TagsService } from "./tags.service";
import { AddTagDto } from "./tags.dto";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "@prisma/client";

@ApiTags("Tags")
@ApiBearerAuth()
@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: "Listar todas as tags" })
  @ApiResponse({ status: 200, description: "Lista de tags" })
  findAll() {
    return this.tagsService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Criar nova tag" })
  @ApiResponse({ status: 201, description: "Tag criada" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(@RequiredBody() dto: AddTagDto) {
    return this.tagsService.getOrCreateTag(dto.tagName);
  }
}
