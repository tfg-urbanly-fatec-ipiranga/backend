import {
  Body, Controller, Delete, Get, NotFoundException,
  Param, ParseUUIDPipe, Post, Put, UploadedFile, UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { CloudinaryService } from "src/common/services/cloudinary/cloudinary.service";

@Controller({ version: "1", path: "users" })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Put(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return this.usersService.update(id, body);
  }

  @Post(":id/avatar")
  @UseInterceptors(FileInterceptor("file"))
  async uploadAvatar(
    @Param("id", ParseUUIDPipe) userId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const response = await this.cloudinaryService.upload(file, userId);
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException("User not found");
    await this.usersService.update(userId, { avatar: response.url });
    return this.usersService.findById(userId);
  }

  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return this.usersService.delete(id);
  }
}
