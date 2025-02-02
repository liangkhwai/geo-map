import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Point } from 'geojson';

// 📌 Places Schema
@Schema({ _id: false })
export class Places {
  @Prop({ type: String, required: true })
  placeId: string;

  @Prop({ type: String, required: true })
  zoneId: string;
}
export const placeSchema = SchemaFactory.createForClass(Places);

// 📌 ImagePath Schema (Subdocument)
@Schema({}) // Ensure virtuals are included in JSON responses
export class ImagePath {
  @Prop({ type: String, required: true })
  url: string;
}
export const imagePathSchema = SchemaFactory.createForClass(ImagePath);

// 📌 Socials Schema (Subdocument)
@Schema()
export class Socials {
  // @Prop({ type: Types.ObjectId, auto: true }) // Auto-generate _id
  // _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  link: string;

  @Prop({ type: String, required: true })
  label: string;
}
export const socialsSchema = SchemaFactory.createForClass(Socials);

// 📌 OTOP Schema
@Schema({ _id: false })
export class OTOP {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  openDaily?: string;

  @Prop({ type: String })
  telNumber?: string;

  @Prop({ type: [imagePathSchema] }) // Define imagePath as an array of ImagePath subdocuments
  imagePath?: ImagePath[];

  @Prop({ type: Number })
  price?: number;

  @Prop({ type: [socialsSchema], default: [] })
  socials?: Socials[];
}
export const otopSchema = SchemaFactory.createForClass(OTOP);

// 📌 Person Schema
@Schema()
export class Person {
  // @Prop({ type: Types.ObjectId, auto: true }) // Auto-generate _id
  // _id: Types.ObjectId;
  @Prop({ type: String })
  title?: string;

  @Prop({ type: String, required: true })
  firstName: string;

  // FIXME: find in service and place here
  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  placeName: string;

  @Prop({ type: String, required: true })
  zoneName: string;

  @Prop({ type: String })
  idCard: string;

  @Prop({ type: String })
  gender?: string;

  @Prop({ type: String })
  telNumber?: string;

  @Prop({ type: String })
  birthdate?: string;

  @Prop({ type: Number })
  age?: number;
}
export const personSchema = SchemaFactory.createForClass(Person);
// 📌 Properties Schema
@Schema({ _id: false })
export class Properties {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  markerType: string;

  @Prop({ type: personSchema, required: true })
  users: Person;

  @Prop({ type: otopSchema, required: false })
  otop?: OTOP;

  @Prop({ type: placeSchema, required: true })
  places: Places;
}
export const propertiesSchema = SchemaFactory.createForClass(Properties);

// 📌 Main Markers Schema
@Schema({ timestamps: true })
export class Markers {
  // @Prop({})
  // _id?: Types.ObjectId;
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (coords: number[]) {
          return coords.length === 2;
        },
        message:
          'Coordinates must have exactly 2 values [longitude, latitude].',
      },
    },
  })
  geometry: Point;

  @Prop({ type: propertiesSchema, required: true })
  properties: Properties;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null = null;
}

const MarkerSchema = SchemaFactory.createForClass(Markers);

// 📌 Index geometry field for geospatial queries
MarkerSchema.index({ geometry: '2dsphere' });

export { MarkerSchema };
