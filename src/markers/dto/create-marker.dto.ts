import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  IsObject,
  IsMongoId,
  IsNotEmptyObject,
  IsNotEmpty,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { Position } from 'geojson';
import { Socials } from '../schemas/markers.schema';

// Person DTO
class Person {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  idCard: string;

  @IsString()
  placeName: string;

  @IsString()
  zoneName: string;

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
  socials?: Socials[];
}

// Places DTO
class Places {
  @IsMongoId()
  placeId: ObjectId;

  @IsMongoId()
  zoneId: ObjectId;
}

// Properties DTO
export class Properties {
  @IsNotEmpty()
  @IsString()
  markerType: string;

  name: string;
  @IsNotEmpty()
  users: Person;
  otop: OTOP;

  @IsNotEmptyObject()
  places: Places;
}

// Location DTO
export class Geometry {
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
