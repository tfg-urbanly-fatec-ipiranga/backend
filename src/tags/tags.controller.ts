import { Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { RequiredBody } from 'src/common/decorators/required-body.decorator';
import { TagsService } from './tags.service';
import { AddTagDto } from './tags.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from 'src/auth/public.decorator';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Public()
    @Get()    
    findAll() {
        return this.tagsService.findAll();
    }

    @Post()
    @Roles(Role.ADMIN)
    create(@RequiredBody() dto: AddTagDto) {
        return this.tagsService.getOrCreateTag(dto.tagName);
    }

    @Get('byname/:name')
    @Roles(Role.USER, Role.ADMIN)
    async findByName(@Param('name') name: string) {
        const tag = await this.tagsService.findByName(name);
        if (!tag) {
            throw new NotFoundException(`Tag '${name}' não encontrada`);
        }
        return tag; // retorna { id, name }
    }
}
