import { Injectable } from '@nestjs/common';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';

@Injectable()
export class MarkersService {
  create(createMarkerDto: CreateMarkerDto) {
    return 'This action adds a new marker';
  }

  findAll() {
    return `This action returns all markers`;
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
