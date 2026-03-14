import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Controller({
    version: '1',
    path: 'users'
})
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

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

    @Post('create')
    create(@Body() body: CreateUserDto) {
        return this.usersService.create(body);
    }

    @Put(':id')
    async update(@Param() params: { id: string }, @Body() body: UpdateUserDto) {
        const user = await this.usersService.findById(params.id)

        if(!user) throw new NotFoundException('User not found')

        return this.usersService.update(params.id, body)
    }

    @Delete(':id')
    async delete(@Param() params: { id: string }) {
        const user = await this.usersService.findById(params.id)

        if(!user) throw new NotFoundException('User not found')

        return this.usersService.delete(params.id)
    }
}
