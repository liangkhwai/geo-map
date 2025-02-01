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
  provinceName: string;
  amphurName: string;
  tambolName: string;
  postCode: string;
  location: {
    type: string,
    coordinates: [number, number]
  }
}
