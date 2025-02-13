import { Types } from 'mongoose';

class GeometryDTO {
  type: string;
  coordinates: number[][][];
}

class FeatureDTO {
  type: string;
  properties: object;
  geometry: GeometryDTO;
}

class FeatureCollectionDTO {
  type: string;
  features: FeatureDTO[];
}

export class CreatePlaceDto {
  municipalityName: string;
  province: Types.ObjectId | string;
  amphurName: string;
  tambolName: string;
  postCode: string;
  population: number;
  household: Number;
  location: {
    type: string,
    coordinates: [number, number]
  }
  pinTypes: string[]
}
