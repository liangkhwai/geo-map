import { Injectable } from '@nestjs/common';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MarkerDocument } from './schemas/markers.schema';
import { Model } from 'mongoose';
import { GetMarkerDto } from './dto/get-marker.dto';

@Injectable()
export class MarkersService {
  constructor(
    @InjectModel('Markers')
    private readonly MarkerRepository: Model<MarkerDocument>,
  ) {}
  async create(createMarkerDto: CreateMarkerDto) {
    console.log(createMarkerDto);
    const createdMarker = new this.MarkerRepository(createMarkerDto);
    return await createdMarker.save();
  }

  async findAll(req: GetMarkerDto) {
    const filter: any = {};
    if (req.zoneId) {
      filter['properties.places.zoneId'] = +req.zoneId;
    }

    if (req.placeId) {
      filter['properties.places.placeId'] = +req.placeId;
    }
    console.log(filter);
    const projection = {
      _id: 1,
      location: 1,
      'properties.markerType': 1,
      'properties.places': 1,
    };
    const result = await this.MarkerRepository.find(filter)
      .select(projection)
      .exec();
    console.log(result);
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} marker`;
  }

  update(id: number, updateMarkerDto: UpdateMarkerDto) {
    return `This action updates a #${id} marker`;
  }

  remove(id: number) {
    return `This action removes a #${id} marker`;
  }
}
