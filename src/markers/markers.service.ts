import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMarkerDto, Properties } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo, ObjectId, Types } from 'mongoose';
import mongoose from 'mongoose';
import {
  FindOneReqDTO,
  GetCountRequestDTO,
  GetMakerDataDTO,
  GetMarkerAdminDTO,
  GetMarkerDTO,
  ResponseGeometry,
} from './dto/get-marker.dto';
import { convertISOToAsia } from 'src/utils/datetime.utils';
import { Markers, MarkerSchema } from './schemas/markers.schema';
@Injectable()
export class MarkersService {
  constructor(
    @InjectModel(Markers.name)
    private readonly MarkerRepository: Model<Markers>,
  ) {}
  // CREATE

  async create(createMarkerDto: CreateMarkerDto) {
    try {
      console.log('QUERY', createMarkerDto);
      const createdMarker = new this.MarkerRepository(createMarkerDto);
      const res = await createdMarker.save();
      console.log('RES', res);
      return res;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  // GET

  async findMarkerByUser(req: GetMarkerDTO) {
    try {
      const filter: any = {};

      if (req.markerType) {
        filter['properties.markerType'] = req.markerType;
      }
      if (req.zoneId) {
        filter['properties.places.zoneId'] = req.zoneId;
      }
      if (req.placeId) {
        filter['properties.places.placeId'] = req.placeId;
      }

      const projection = {
        _id: 1,
        geometry: 1,
        createdAt: 1,
        updatedAt: 1,
        'properties.markerType': 1,
        'properties.places': 1,
        'properties.otop': 1,
      };

      const results = await this.MarkerRepository.find(filter)
        .where('deletedAt')
        .equals(null)
        .select(projection)
        .exec();

      return results.map((marker) => {
        const response = new ResponseGeometry();
        response.setResponse(marker);
        return response.toJSON();
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findMarkerByAdmin(req: GetMarkerAdminDTO) {
    try {
      const filter: any = {};

      if (req.markerType) {
        filter['properties.markerType'] = req.markerType;
      }
      if (req.zoneId) {
        filter['properties.places.zoneId'] = req.zoneId;
      }
      if (req.placeId) {
        filter['properties.places.placeId'] = req.placeId;
      }

      const results = await this.MarkerRepository.find(filter)
        .where('deletedAt')
        .equals(null)
        .exec();
      console.log('RES->>', results);
      return results.map((marker) => {
        const response = new ResponseGeometry();
        response.setResponse(marker);
        return response.toJSON();
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getMarkerDataByAdmin(req: GetMakerDataDTO) {
    try {
      const filter: any = {};

      if (req.markerType) {
        filter['properties.markerType'] = req.markerType;
      }
      if (req.zoneId) {
        filter['properties.places.zoneId'] = req.zoneId;
      }
      if (req.placeId) {
        filter['properties.places.placeId'] = req.placeId;
      }

      const page = Number(req.page) || 1;
      const itemsPerPage = Number(req.itemsPerPage) || 10;
      const skip = (page - 1) * itemsPerPage;

      const [results, total] = await Promise.all([
        this.MarkerRepository.find(filter)
          .lean()
          .skip(skip)
          .where('deletedAt')
          .equals(null)
          .limit(itemsPerPage)
          .sort({ updatedAt: -1 })
          .exec(),
        this.MarkerRepository.countDocuments(filter).exec(),
      ]);

      results.map((marker) => {
        const response = new ResponseGeometry();
        response.setResponse(marker);
        return response.toJSON();
      });

      return {
        data: results,
        pagination: {
          total,
          page,
          itemsPerPage,
          totalPages: Math.ceil(total / itemsPerPage),
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneByUser(markerId: string) {
    try {
      const result = await this.MarkerRepository.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(markerId),
            deletedAt: null,
          },
        },
        {
          $project: {
            _id: 1,
            geometry: 1,
            properties: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $unset: ['properties.users'],
        },
      ]).exec();

      return result.map((marker) => {
        const response = new ResponseGeometry();
        response.setResponse(marker);
        return response.toJSON();
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
  async findOneByAdmin(markerId: string) {
    try {
      const result = await this.MarkerRepository.find({
        _id: new Types.ObjectId(markerId),
      })
        .where('deletedAt')
        .equals(null)
        .lean();
      console.log('res from find one admin', result);
      return result.map((marker) => {
        const response = new ResponseGeometry();
        response.setResponse(marker);
        return response.toJSON();
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // UPDATE
  async updateByAdmin(id: string, updateMarkerDto: UpdateMarkerDto) {
    const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
      return Object.keys(obj || {}).reduce(
        (acc, key) => {
          const value = obj[key];
          const newKey = prefix ? `${prefix}.${key}` : key;
          if (value !== undefined && value !== null) {
            if (typeof value === 'object' && !Array.isArray(value)) {
              Object.assign(acc, flattenObject(value, newKey));
            } else {
              acc[newKey] = value;
            }
          }
          return acc;
        },
        {} as Record<string, any>,
      );
    };

    const updateData = flattenObject(updateMarkerDto);

    if (updateMarkerDto.geometry?.coordinates) {
      const { coordinates } = updateMarkerDto.geometry;
      if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        throw new Error(
          'Coordinates must have exactly two values (latitude and longitude)',
        );
      }
      updateData['geometry.coordinates'] = coordinates;
    }

    const updatedMarker = await this.MarkerRepository.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!updatedMarker) {
      throw new Error('Marker not found');
    }

    return updatedMarker;
  }

  async deleteByAdmin(id: string) {
    try {
      const _id = new mongoose.Types.ObjectId(id);
      return await this.MarkerRepository.findByIdAndUpdate(
        _id,
        {
          $set: { deletedAt: Date.now() },
        },
        { new: true },
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async countMarkerByPlaceId(query: GetCountRequestDTO): Promise<number> {
    const { placeId, zoneId } = query;
    try {
      const filter: object = {
        deletedAt: null,
      };
      if (placeId) {
        filter['properties.places.placeId'] = placeId;
      }
      if (zoneId) {
        filter['properties.places.zoneId'] = zoneId;
      }
      const result = await this.MarkerRepository.countDocuments(filter);
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
