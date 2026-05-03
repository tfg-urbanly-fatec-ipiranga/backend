import {
  Controller, Delete, Get, NotFoundException, Patch,
  Param, ParseUUIDPipe, Post, Put, UploadedFile, UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "@prisma/client";
import { UsersService } from "./users.service";
import { CloudinaryService } from "src/common/services/cloudinary/cloudinary.service";
import { Roles } from "src/auth/roles.decorator";
import { UpdateUserDto } from "./users.dto";
import { RequiredBody } from "src/common/decorators/required-body.decorator";

@Controller({ version: "1", path: "users" })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Roles(Role.USER, Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get("inactive")
  findInactive() {
    return this.usersService.findInactive();
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  @Roles(Role.USER, Role.ADMIN)
  @Put(":id")
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
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return this.usersService.delete(id);
  }

  @Roles(Role.ADMIN)
  @Patch(":id/restore")
  async restore(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.restore(id);
  }
}
