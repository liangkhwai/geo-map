import { Controller, Get, Post, Body, Patch, Param, Query, UseInterceptors, UploadedFile, UploadedFiles, Delete } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryPlaceDto } from './dto/query-place.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'city', maxCount: 1 },
    { name: 'zone', maxCount: 1 },
  ]))
  create(@Body() createPlaceDto: CreatePlaceDto, @UploadedFiles() files: { city?: Express.Multer.File[], zone?: Express.Multer.File[] }) {
    return this.placesService.create(createPlaceDto, files);
  }

  @Get()
  findAll(@Query() keywords: QueryPlaceDto) {
    return this.placesService.findAll(keywords);
  }

  @Get("city")
  findAllCityAndIds(){
    return this.placesService.findAllCityAndIds();
  }

  @Get("zone")
  findAllZoneAndIds(){
    return this.placesService.findAllZoneAndIds();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.placesService.delete(id);
  }
}
