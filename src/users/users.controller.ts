import {
  Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put, UploadedFile, UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "@prisma/client";
import { UsersService } from "./users.service";
import { CloudinaryService } from "src/common/services/cloudinary/cloudinary.service";
import { Roles } from "src/auth/roles.decorator";
import { UpdateUserDto } from "./users.dto";
import { RequiredBody } from "src/common/decorators/required-body.decorator";

@ApiTags("Users")
@ApiBearerAuth()
@Controller({ version: "1", path: "users" })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Roles(Role.USER, Role.ADMIN)
  @Get()
  @ApiOperation({ summary: "Listar todos os usuários" })
  @ApiResponse({ status: 200, description: "Lista de usuários" })
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get(":id")
  @ApiOperation({ summary: "Buscar usuário por ID" })
  @ApiResponse({ status: 200, description: "Usuário encontrado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  @Roles(Role.USER, Role.ADMIN)
  @Put(":id")
  @ApiOperation({ summary: "Atualizar usuário" })
  @ApiResponse({ status: 200, description: "Usuário atualizado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @RequiredBody() body: UpdateUserDto,
  ) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return this.usersService.update(id, body);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Post(":id/avatar")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload de avatar do usuário" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Avatar atualizado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  async uploadAvatar(
    @Param("id", ParseUUIDPipe) userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException("User not found");
    const response = await this.cloudinaryService.upload(file, userId);
    await this.usersService.update(userId, { avatar: response.url });
    return this.usersService.findById(userId);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  @ApiOperation({ summary: "Deletar usuário" })
  @ApiResponse({ status: 200, description: "Usuário deletado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return this.usersService.delete(id);
  }
}
