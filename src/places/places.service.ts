import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Place, PlaceDocument } from './schemas/place.shema';
import { Model, Types } from 'mongoose';
import { QueryPlaceDto } from './dto/query-place.dto';
import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import * as xmldom from 'xmldom';
import * as togeojson from '@mapbox/togeojson';
import { CreatePlaceDto } from './dto/create-place.dto';
import { MarkersService } from 'src/markers/markers.service';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place.name) private readonly placeModel: Model<PlaceDocument>,
    private readonly markerService: MarkersService,
  ) {}

  async create(
    createPlaceDto: CreatePlaceDto,
    files: {
      city?: Express.Multer.File[];
      zone?: Express.Multer.File[];
    },
  ) {
    try {
      const cityFile = files.city ? files.city[0] : null;
      const zoneFile = files.zone ? files.zone[0] : null;

      if (!cityFile || !zoneFile) {
        return {
          message: 'Both city and zone files are required.',
        };
      }

      const cityData = this.convertKMZtoGeoJSON(cityFile.path);
      const zoneData = this.convertKMZtoGeoJSON(zoneFile.path);

      if (
        cityData.type !== 'FeatureCollection' ||
        zoneData.type !== 'FeatureCollection'
      ) {
        throw new BadRequestException('Invalid GeoJSON format');
      }

      const newPlace = new this.placeModel({
        municipalityName: createPlaceDto.municipalityName,
        provinceName: createPlaceDto.provinceName,
        amphurName: createPlaceDto.amphurName,
        tambolName: createPlaceDto.tambolName,
        postCode: createPlaceDto.postCode,
        location: createPlaceDto.location,
        place: cityData,
        zones: zoneData,
      });

      await newPlace.save();

      await fs.promises.unlink(cityFile.path);
      await fs.promises.unlink(zoneFile.path);

      return newPlace;
    } catch (error) {
      throw new BadRequestException(`Failed to create place: ${error.message}`);
    }
  }

  async findAll(keywords: QueryPlaceDto) {
    try {
      const pipeline: any[] = [];
      const summary: any = {};

      if (keywords.placeId) {
        pipeline.push({
          $match: {
            _id: new Types.ObjectId(keywords.placeId),
            deletedAt: { $eq: null },
          },
        });
        summary['placeId'] = new Types.ObjectId(keywords.placeId);
      }

      if (keywords.zoneId) {
        pipeline.push(
          {
            $unwind: '$zones.features',
          },
          {
            $match: {
              'zones.features._id': new Types.ObjectId(keywords.zoneId),
              'zones.features.deletedAt': { $eq: null },
            },
          },
        );
        summary['zoneId'] = new Types.ObjectId(keywords.zoneId);
      }

      if (!keywords.placeId && !keywords.zoneId) {
        pipeline.push({
          $match: { deletedAt: { $eq: null } },
        });
      }

      const response = await this.placeModel.aggregate(pipeline).exec();

      const summaryCountMarker = await this.markerService.countMarker({
        placeId: summary['placeId'],
        zoneId: summary['zoneId'],
        markerType: '',
      });

      if (!response || response.length === 0) {
        return [];
      }

      return {
        data: response,
        markerCount: summaryCountMarker,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error retrieving places',
        error.message,
      );
    }
  }

  async findAllCityAndIds() {
    try {
      const places = await this.placeModel
        .find({deletedAt: { $eq: null }}, { 'place.features': 1 })
        .exec();

      const response = places.flatMap((plcae) =>
        plcae.place.features.map((feature) => ({
          id: plcae._id,
          name: feature.properties?.name ?? 'N/A',
        })),
      );

      return response;
    } catch (error) {
      throw new Error(`Error retrieving city names and IDs: ${error.message}`);
    }
  }

  async findAllZoneAndIds(keywords?: {placeId: string}) {
    try {
      const query: any = { deletedAt: { $eq: null } };
      
      if (keywords?.placeId){
        query["_id"] = new Types.ObjectId(keywords.placeId);
      }

      const places = await this.placeModel
        .find(query, { 'zones.features': 1 })
        .exec();

      const response = places.flatMap((plcae) =>
        plcae.zones.features.map((feature) => ({
          id: feature['_id'],
          name: feature.properties?.community ?? 'N/A',
        })),
      );

      return response;
    } catch (error) {
      throw new Error(`Error retrieving zone names and IDs: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const _id = new Types.ObjectId(id);
      const place = await this.placeModel
        .findById({ _id, deletedAt: null })
        .exec();
      if (!place) {
        throw new NotFoundException(`Place with ID ${id} not found`);
      }

      return place;
    } catch (error) {
      throw new NotFoundException(`Failed to find place: ${error.message}`);
    }
  }

  async update(
    id: string,
    updatePlaceDto: UpdatePlaceDto,
    files?: {
      city?: Express.Multer.File[];
      zone?: Express.Multer.File[];
    },
  ) {
    try {
      const _id = new Types.ObjectId(id);
      const existingPlace = await this.placeModel.findOne({
        _id,
        deletedAt: null,
      });

      if (!existingPlace) {
        throw new NotFoundException(`Place with ID ${id} not found`);
      }

      if (files?.city?.[0]) {
        existingPlace.place = this.convertKMZtoGeoJSON(files.city[0].path);
      }
      if (files?.zone?.[0]) {
        existingPlace.zones = this.convertKMZtoGeoJSON(files.zone[0].path);
      }

      Object.assign(existingPlace, updatePlaceDto);

      await existingPlace.save();

      if (files?.city?.[0]) {
        await fs.promises.unlink(files.city[0].path);
      }
      if (files?.zone?.[0]) {
        await fs.promises.unlink(files.zone[0].path);
      }

      return existingPlace;
    } catch (error) {
      throw new InternalServerErrorException('Error updating place');
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const placeToDelete = await this.findOne(id);

      if (!placeToDelete) {
        throw new NotFoundException('Place not found');
      }

      await this.placeModel.findByIdAndUpdate(id, { deletedAt: new Date() });

      return 'Place deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException('Error deleting place');
    }
  }

  private convertKMZtoGeoJSON(file: string) {
    try {
      const zip = new AdmZip(file);
      const outputDir = path.join(__dirname, 'uploads', 'unzipped');
      zip.extractAllTo(outputDir, true);

      const kmlFile = fs
        .readdirSync(outputDir)
        .find((file) => file.endsWith('.kml'));
      if (!kmlFile) {
        throw new Error('No KML file found inside KMZ archive');
      }

      const kmlFilePath = path.join(outputDir, kmlFile);
      const kmlData = fs.readFileSync(kmlFilePath, 'utf-8');

      const parser = new xmldom.DOMParser();
      const kmlDoc = parser.parseFromString(kmlData, 'application/xml');

      const geoJson = togeojson.kml(kmlDoc);

      fs.rmSync(outputDir, { recursive: true, force: true });

      return geoJson;
    } catch (error) {
      throw new Error(`Failed to convert KMZ to GeoJSON: ${error.message}`);
    }
  }
}
