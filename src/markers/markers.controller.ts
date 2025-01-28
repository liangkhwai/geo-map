import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';

@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @Post()
  create(@Body() createMarkerDto: CreateMarkerDto) {
    return this.markersService.create(createMarkerDto);
  }

  @Get()
  findAll() {
    return this.markersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.markersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarkerDto: UpdateMarkerDto) {
    return this.markersService.update(+id, updateMarkerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.markersService.remove(+id);
  }
}
