import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  InternalServerErrorException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import {
  FindOneReqDTO,
  GetCountRequestDTO,
  GetMakerDataDTO,
  GetMarkerAdminDTO,
  GetMarkerDTO,
} from './dto/get-marker.dto';
import { UseGuards } from '@nestjs/common';

@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  // User Endpoints
  @Post()
  create(@Body() createMarkerDto: CreateMarkerDto) {
    console.log('POST /markers - Create Marker');
    return this.markersService.create(createMarkerDto);
  }

  @Get()
  findMarkerByUser(@Query() req: GetMarkerDTO) {
    console.log('GET /markers - Find Markers By User', req);
    return this.markersService.findMarkerByUser(req);
  }

  @Get('/:markerId')
  findOneByUser(@Param('markerId') markerId: string) {
    console.log('GET /markers/:markerId - Find Marker By User', markerId);
    return this.markersService.findOneByUser(markerId);
  }

  // Admin Endpoints
  @HttpCode(HttpStatus.OK)
  @Get('/private/admin')
  async findMarkerByAdmin(@Query() req: GetMarkerAdminDTO) {
    console.log('GET /markers/private/admin - Find Markers By Admin', req);
    return await this.markersService.findMarkerByAdmin(req);
  }

  @Get('/private/admin/data')
  getDataMaker(@Query() req: GetMakerDataDTO) {
    console.log('GET /markers/private/admin/data - Get Data Maker', req);
    return this.markersService.getMarkerDataByAdmin(req);
  }

  @Get('/private/admin/count')
  countMarker(@Query() query: GetCountRequestDTO) {
    console.log('GET /markers/private/admin/count - Count Markers', query);
    return this.markersService.countMarkerByPlaceId(query);
  }

  @Get('/private/admin/:markerId')
  findOneByAdmin(@Param('markerId') markerId: string) {
    console.log(
      'GET /markers/private/admin/:markerId - Find Marker By Admin',
      markerId,
    );
    return this.markersService.findOneByAdmin(markerId);
  }

  @Patch('/private/admin/:id')
  update(@Param('id') id: string, @Body() updateMarkerDto: UpdateMarkerDto) {
    console.log(
      'PATCH /markers/private/admin/:id - Update Marker',
      id,
      updateMarkerDto,
    );
    return this.markersService.updateByAdmin(id, updateMarkerDto);
  }

  @Delete('/private/admin/:id')
  remove(@Param('id') id: string) {
    console.log('DELETE /markers/private/admin/:id - Delete Marker', id);
    return this.markersService.deleteByAdmin(id);
  }
}
