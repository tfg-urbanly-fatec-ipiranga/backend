import { Controller, Get, Post } from '@nestjs/common';
import { RequiredBody } from 'src/common/decorators/required-body.decorator';
import { TagsService } from './tags.service';
import { AddTagDto } from './tags.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Get()
    @Roles(Role.USER, Role.ADMIN)
    findAll() {
        return this.tagsService.findAll();
    }

    @Post()
    @Roles(Role.ADMIN)
    create(@RequiredBody() dto: AddTagDto) {
        return this.tagsService.getOrCreateTag(dto.tagName);
    }
}
