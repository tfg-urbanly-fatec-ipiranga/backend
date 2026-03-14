import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';

@Controller({
    version: '1',
    path: 'users'
})
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findById(@Param() params: { id: string }) {
        const user = await this.usersService.findById(params.id)

        if(!user) throw new NotFoundException('User not found')
        
        return user
    }

    @Get('findByEmail/:email')
    async findByEmail(@Param() params: { email: string }) {
        const user = await this.usersService.findByEmail(params.email)

        if(!user) throw new NotFoundException('User not found')

        return user
    }

    @Get('findByUserName/:userName')
    async findByUserName(@Param() params: { userName: string }) {
        const user = await this.usersService.findByUserName(params.userName)

        if(!user) throw new NotFoundException('User not found')

        return user
    }

    @Post()
    create(@Body() body: CreateUserDto) {
        return this.usersService.create(body);
    }

    @Put(':id')
    async update(@Param() params: { id: string }, @Body() body: UpdateUserDto) {
        const user = await this.usersService.findById(params.id)

        if(!user) throw new NotFoundException('User not found')

        return this.usersService.update(params.id, body)
    }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
        const userId = "b3761bd3-079f-49bf-9718-848dda2b2ca9"

        const response = await this.cloudinaryService.upload(file, userId)

        const user = await this.usersService.findById(userId)

        if(!user) throw new NotFoundException('User not found')

        await this.usersService.update(userId, {
            avatar: response.url
        })

        return this.usersService.findById(userId)
    }

    @Delete(':id')
    async delete(@Param() params: { id: string }) {
        const user = await this.usersService.findById(params.id)

        if(!user) throw new NotFoundException('User not found')

        return this.usersService.delete(params.id)
    }
}
