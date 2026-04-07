import { Controller, Get, Post } from '@nestjs/common';
import { RequiredBody } from 'src/common/decorators/required-body.decorator';
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
    create(@RequiredBody() dto: AddTagDto) {
        return this.tagsService.getOrCreateTag(dto.tagName);
    }
}
