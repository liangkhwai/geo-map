import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  IsObject,
  IsMongoId,
  IsNotEmptyObject,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { Position } from 'geojson';

// Person DTO
class Person {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  firstName: string;

  @IsString()
  placeName: string;

  @IsString()
  zoneName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  telNumber?: string;

  @IsOptional()
  @IsString()
  birthdate?: string;

  @IsOptional()
  @IsNumber()
  age?: number;
}

// OTOP DTO
class OTOP {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  openDaily?: string;

  @IsOptional()
  @IsString()
  telNumber?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagePath?: string[];

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  socials?: { link: string; label: string }[];
}

// Places DTO
class Places {
  @IsMongoId()
  placeId: ObjectId;

  @IsMongoId()
  zoneId: ObjectId;
}

// Properties DTO
class Properties {
  @IsString()
  markerType: string;

  detail: Person | OTOP;

  @IsNotEmptyObject()
  places: Places;
}

// Location DTO
class Geometry {
  @IsEnum(['Point'])
  type: 'Point';

  @IsNotEmptyObject()
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: Position; // [longitude, latitude]
}

export class CreateMarkerDto {
  @IsObject()
  geometry: Geometry;

  @IsObject()
  properties: Properties;
}
