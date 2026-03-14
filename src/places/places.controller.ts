import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto, UpdatePlaceDto } from './places.dto';

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

    @Delete(':id')
    async delete(@Param() params: { id: string }) {
        const place = await this.placesService.findById(params.id)

        if (!place) throw new NotFoundException('Place not found')

        return this.placesService.delete(params.id)
    }
}
