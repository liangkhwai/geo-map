import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProvinceDocument = Province & Document;

@Schema()
export class Province {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ type: String, required: true })
  name_th: string;

  @Prop({ type: String, required: true })
  name_en: string;

  @Prop({ required: true })
  geography_id: number;

  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
