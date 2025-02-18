import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type PlaceDocument = Place & Document;

@Schema({ timestamps: true })
export class Place {
  @Prop({ type: String })
  placeId: String;

  @Prop({ type: String, required: true })
  municipalityName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true })
  province: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  amphurName: string;

  @Prop({ type: String, required: true })
  tambolName: string;

  @Prop({ type: String, required: true })
  postCode: string;

  @Prop({type: Number, required: true})
  population: number;

  @Prop({type: Number, required: true})
  household: Number;

  @Prop({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  })
  location: { type: string; coordinates: [number, number] };

  @Prop({
    type: {
      type: String,
      enum: ['FeatureCollection'],
      required: true,
    },
    features: [
      {
        type: { type: String, enum: ['Feature'], required: true },
        properties: {
          type: Object,
          default: {},
        },
        geometry: {
          type: { type: String, enum: ['Polygon'], required: true },
          coordinates: { type: [[[Number]]], required: true },
        },
      },
    ],
  })
  place: {
    type: string;
    features: Array<{
      type: string;
      properties: any;
      geometry: {
        type: string;
        coordinates: number[][];
      };
    }>;
  };

  @Prop({
    type: {
      type: String,
      enum: ['FeatureCollection'],
      required: true,
    },
    features: [
      {
        type: { type: String, enum: ['Feature'], required: true },
        properties: {
          type: Object,
          default: {},
        },
        geometry: {
          type: { type: String, enum: ['Polygon'], required: true },
          coordinates: { type: [[[Number]]], required: true },
        },
      },
    ],
  })
  zones: {
    type: string;
    features: Array<{
      type: string;
      properties: any;
      geometry: {
        type: string;
        coordinates: number[][];
      };
    }>;
  };

  @Prop({ type: [String], default: [] })
  pinTypes: string[];

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null = null;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);

PlaceSchema.index({ 'place.location': '2dsphere' });

PlaceSchema.pre('save', async function (next) {
  const place = this;

  if (!place.placeId) {
    try {
      const lastPlace = await this.model('Place')
        .findOne()
        .sort({ placeId: -1 })
        .limit(1)
        .exec();
      const lastId = lastPlace
        ? parseInt((lastPlace as unknown as PlaceDocument).placeId.substring(2))
        : 0;

      place.placeId = `CT${String(lastId + 1).padStart(2, '0')}`;
    } catch (error) {
      console.error('Error generating placeId:', error);
      place.placeId = 'CT01';
    }
  }

  next();
});
