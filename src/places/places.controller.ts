import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto, FindPlacesByTagDto, UpdatePlaceDto } from './places.dto';
import { AddTagDto } from 'src/tags/tags.dto';

@Controller({
    version: '1',
    path: 'places'
})
export class PlacesController {
    constructor(private readonly placesService: PlacesService) { }

    @Post()
    create(@Body() body: CreatePlaceDto) {
        return this.placesService.create(body)
    }

    @Get()
    findAll() {
        return this.placesService.findAll()
    }

    @Get('search')
    searchByTag(@Query() query: FindPlacesByTagDto) {
        return this.placesService.findByTag(query);
    }

    @Get(':id')
    async findById(@Param() params: { id: string }) {
        const place = await this.placesService.findById(params.id)

        if (!place) throw new NotFoundException('Place not found')

        return place
    }

    @Put(':id')
    async update(@Param() params: { id: string }, @Body() body: UpdatePlaceDto) {
        const place = await this.placesService.findById(params.id)

        if (!place) throw new NotFoundException('Place not found')

        return this.placesService.update(params.id, body)
    }

    @Post(':id/tags')
    async addTagToPlace(
        @Param('id') placeId: string,
        @Body() body: AddTagDto,
    ) {
        return this.placesService.addTag(placeId, body.tagName);
    }

    @Delete(':id')
    async delete(@Param() params: { id: string }) {
        const place = await this.placesService.findById(params.id)

        if (!place) throw new NotFoundException('Place not found')

        return this.placesService.delete(params.id)
    }
}
