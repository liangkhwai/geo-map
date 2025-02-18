import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GeographyDocument = Geography & Document;

@Schema()
export class Geography {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ type: String, required: true })
  name: string;
}

export const GeographySchema = SchemaFactory.createForClass(Geography);
