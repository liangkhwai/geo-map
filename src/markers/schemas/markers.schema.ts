import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Point } from 'geojson';

export type MarkerDocument = Markers & Document;

export enum DetailType {
  Person = 'person',
  OTOP = 'otop',
}

@Schema({ timestamps: true })
export class Markers {
  @Prop({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  })
  geometry: Point;

  @Prop({
    type: Object,
    required: true,
  })
  properties: {
    name: string;
    markerType: string;
    detail: DetailType; // Use enum
    places: {
      placeId: string;
      zoneId: string;
    };
  };

  @Prop({
    type: Object,
    required: false,
  })
  detailData: Person | OTOP;
}

// Person Class
export class Person {
  @Prop({ type: String })
  title?: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  placeName: string;

  @Prop({ type: String, required: true })
  zoneName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String })
  gender?: string;

  @Prop({ type: String })
  telNumber?: string;

  @Prop({ type: String })
  birthdate?: string; 

  @Prop({ type: Number })
  age?: number; 
}

// OTOP Class
export class OTOP {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  openDaily?: string;

  @Prop({ type: String })
  telNumber?: string;

  @Prop({ type: [String] })
  imagePath?: string[];

  @Prop({ type: Number })
  price?: number;

  @Prop({ type: [{ link: String, label: String }] })
  socials?: { link: string; label: string }[];
}

const MarkerSchema = SchemaFactory.createForClass(Markers);

MarkerSchema.index({ geometry: '2dsphere' });

export { MarkerSchema };
