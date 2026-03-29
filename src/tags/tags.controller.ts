import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { AddTagDto } from './tags.dto';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Get()
    findAll() {
        return this.tagsService.findAll();
    }

    @Post()
    create(@Body() dto: AddTagDto) {
        return this.tagsService.getOrCreateTag(dto.tagName);
    }
}
