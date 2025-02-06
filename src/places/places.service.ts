import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Place, PlaceDocument } from './schemas/place.schema';
import { Model, Types } from 'mongoose';
import { QueryPlaceDto } from './dto/query-place.dto';
import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import * as xmldom from 'xmldom';
import * as togeojson from '@mapbox/togeojson';
import { CreatePlaceDto } from './dto/create-place.dto';
import { MarkersService } from 'src/markers/markers.service';
import { Province, ProvinceDocument } from './schemas/province.schema';
import { Geography, GeographyDocument } from './schemas/geography.schema';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place.name) private readonly placeModel: Model<PlaceDocument>,
    @InjectModel(Province.name)
    private readonly provinceModel: Model<ProvinceDocument>,
    @InjectModel(Geography.name)
    private readonly geographyModel: Model<GeographyDocument>,
    private readonly markerService: MarkersService,
  ) {}

  async create(
    createPlaceDto: CreatePlaceDto,
    files: { city?: Express.Multer.File[]; zone?: Express.Multer.File[] },
  ) {
    try {
      const cityFile = files.city?.[0] || null;
      const zoneFile = files.zone?.[0] || null;

      if (!cityFile || !zoneFile) {
        throw new BadRequestException('Both city and zone files are required.');
      }

      const [cityData, zoneData] = await Promise.all([
        this.convertKMZtoGeoJSON(cityFile.path),
        this.convertKMZtoGeoJSON(zoneFile.path),
      ]);

      if (
        cityData.type !== 'FeatureCollection' ||
        zoneData.type !== 'FeatureCollection'
      ) {
        throw new BadRequestException('Invalid GeoJSON format');
      }

      if (
        !Array.isArray(createPlaceDto.pinTypes) ||
        !createPlaceDto.pinTypes.every((pin) => typeof pin === 'string')
      ) {
        throw new BadRequestException('pinTypes must be an array of strings.');
      }

      const newPlace = new this.placeModel({
        ...createPlaceDto,
        place: cityData,
        zones: zoneData,
      });

      await newPlace.save();

      await Promise.all([
        fs.promises.unlink(cityFile.path),
        fs.promises.unlink(zoneFile.path),
      ]);

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

      if (keywords.provinceId) {
        pipeline.push({
          $match: {
            province: new Types.ObjectId(keywords.provinceId),
          },
        });
      }
      
      pipeline.push({
        $lookup: {
          from: 'provinces',
          localField: 'province',
          foreignField: '_id',
          as: 'province',
        },
      });

      pipeline.push({
        $unwind: {
          path: '$province',
          preserveNullAndEmptyArrays: true,
        },
      });

      if (keywords.geographyId) {
        pipeline.push({
          $match: {
            'province.geography_id': Number(keywords.geographyId),
          },
        });
      }

      if (!keywords.placeId && !keywords.zoneId && !keywords.provinceId && !keywords.geographyId) {
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
        .find({ deletedAt: { $eq: null } }, { 'place.features': 1 })
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

  async findAllZoneAndIds(keywords?: { placeId: string }) {
    try {
      const query: any = { deletedAt: { $eq: null } };

      if (keywords?.placeId) {
        query['_id'] = new Types.ObjectId(keywords.placeId);
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

  async findAllProvinces(keywords?: { geographyId: string }) {
    try {
      const query: any = {};

      if (keywords?.geographyId) {
        query['geography_id'] = keywords.geographyId;
      }

      const provinces = await this.provinceModel.find(query).exec();

      return provinces;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving provinces');
    }
  }

  async findAllNameProvinces(keywords?: { geographyId: string }) {
    try {
      const query: any = {};

      if (keywords?.geographyId) {
        query['geography_id'] = keywords.geographyId;
      }

      return await this.provinceModel
        .find(query, { _id: 1, name_th: 1 })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllGeographies() {
    try {
      const geographies = await this.geographyModel.find({}, { _id: 0 }).exec();

      return geographies;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving provinces');
    }
  }

  async findOne(id: string) {
    try {
      const _id = new Types.ObjectId(id);
      const place = await this.placeModel
        .findById({ _id, deletedAt: null })
        .populate('province')
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
    files?: { city?: Express.Multer.File[]; zone?: Express.Multer.File[] },
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

      const geoJsonUpdates: Partial<{ place: any; zones: any }> = {};

      if (files?.city?.[0] || files?.zone?.[0]) {
        const [cityData, zoneData] = await Promise.all([
          files?.city?.[0]
            ? this.convertKMZtoGeoJSON(files.city[0].path)
            : null,
          files?.zone?.[0]
            ? this.convertKMZtoGeoJSON(files.zone[0].path)
            : null,
        ]);

        if (cityData?.type !== 'FeatureCollection' && cityData !== null) {
          throw new BadRequestException('Invalid GeoJSON format for city');
        }
        if (zoneData?.type !== 'FeatureCollection' && zoneData !== null) {
          throw new BadRequestException('Invalid GeoJSON format for zone');
        }

        if (cityData) geoJsonUpdates.place = cityData;
        if (zoneData) geoJsonUpdates.zones = zoneData;
      }

      if (
        updatePlaceDto.pinTypes &&
        (!Array.isArray(updatePlaceDto.pinTypes) ||
          !updatePlaceDto.pinTypes.every((pin) => typeof pin === 'string'))
      ) {
        throw new BadRequestException('pinTypes must be an array of strings.');
      }

      Object.assign(existingPlace, updatePlaceDto, geoJsonUpdates);

      await existingPlace.save();

      if (files?.city?.[0] || files?.zone?.[0]) {
        await Promise.all([
          files?.city?.[0] ? fs.promises.unlink(files.city[0].path) : null,
          files?.zone?.[0] ? fs.promises.unlink(files.zone[0].path) : null,
        ]);
      }

      return existingPlace;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating place: ${error.message}`,
      );
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
