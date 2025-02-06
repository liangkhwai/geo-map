import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryPlaceDto } from './dto/query-place.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'city', maxCount: 1 },
      { name: 'zone', maxCount: 1 },
    ]),
  )
  create(
    @Body() createPlaceDto: CreatePlaceDto,
    @UploadedFiles()
    files: { city?: Express.Multer.File[]; zone?: Express.Multer.File[] },
  ) {
    return this.placesService.create(createPlaceDto, files);
  }

  @Get()
  findAll(@Query() keywords: QueryPlaceDto) {
    return this.placesService.findAll(keywords);
  }

  @Get('city')
  findAllCityAndIds() {
    return this.placesService.findAllCityAndIds();
  }

  @Get('zone')
  findAllZoneAndIds(@Query() keywords: { placeId: string }) {
    return this.placesService.findAllZoneAndIds(keywords);
  }

  @Get('province')
  findAllProvinces(@Query() keywords: {geographyId: string}) {
    return this.placesService.findAllProvinces(keywords);
  }

  @Get('province/name')
  findAllNameProvinces(@Query() keywords: {geographyId: string}) {
    return this.placesService.findAllNameProvinces(keywords);
  }

  @Get('geography')
  findAllGeographies() {
    return this.placesService.findAllGeographies();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'city', maxCount: 1 },
      { name: 'zone', maxCount: 1 },
    ]),
  )
  update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @UploadedFiles()
    files: { city?: Express.Multer.File[]; zone?: Express.Multer.File[] },
  ) {
    return this.placesService.update(id, updatePlaceDto, files);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.placesService.delete(id);
  }
}
