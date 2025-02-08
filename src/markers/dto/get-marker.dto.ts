import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Point } from 'geojson';
import { isValidObjectId, ObjectId, Types } from 'mongoose';
import { Markers, MarkerSchema, Properties } from '../schemas/markers.schema';
import { convertISOToAsia } from 'src/utils/datetime.utils';
import { CreateMarkerDto } from './create-marker.dto';
export class ResponseMarkerDB extends Markers {
  _id: Types.ObjectId;
}
export class GetMarkerDTO {
  @IsOptional()
  markerType: string;
  @IsOptional()
  zoneId: string;
  @IsNotEmpty()
  placeId: string;
}
export class GetMarkerAdminDTO extends GetMarkerDTO {
  @IsOptional()
  placeId: string;
}
export class GetCountRequestDTO {
  @IsOptional()
  placeId: string | ObjectId;
  @IsOptional()
  zoneId: string | ObjectId;
  @IsOptional()
  markerType:string
}

export class GetMakerDataDTO {
  @IsOptional()
  markerType: String;

  @IsOptional()
  zoneId: ObjectId;
  @IsOptional()
  placeId: ObjectId;

  @IsOptional()
  page: number;
  @IsOptional()
  itemsPerPage: number;
}

export class FindOneReqDTO {
  @IsNotEmpty()
  @IsString()
  markerId: string;
}

export class ResponseGeometry {
  type: string = 'Feature';
  geometry: Point | null = null;
  properties: Properties | null = null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null = null;
  _id?: Types.ObjectId;

  setResponse(marker: ResponseMarkerDB) {
    console.log('RESPONSE', marker);
    this._id = marker._id;
    this.geometry = this.swapGeometryCoordinates(marker.geometry)
    this.properties = marker.properties;
    this.createdAt = marker.createdAt;
    this.updatedAt = marker.updatedAt;
    this.deletedAt = marker.deletedAt ?? null;
  }
  swapGeometryCoordinates(geometry: Point | null): Point | null {
    if (
      geometry &&
      geometry.type === 'Point' &&
      Array.isArray(geometry.coordinates)
    ) {
      const [lng, lat] = geometry.coordinates;
      geometry.coordinates = [lat, lng]; // Swap lng,lat to lat,lng
    }
    return geometry;
  }

  toJSON(): object {
    return {
      _id: this._id,
      type: this.type,
      geometry: this.geometry,
      properties: this.properties,
      createdAt: convertISOToAsia(this.createdAt.toISOString()),
      updatedAt: convertISOToAsia(this.updatedAt.toISOString()),
      deletedAt: this.deletedAt
        ? convertISOToAsia(this.deletedAt.toISOString())
        : null,
    };
  }
}
