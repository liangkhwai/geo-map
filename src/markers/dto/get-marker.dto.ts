import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';
export class GetMarkerDto {
  @IsOptional()
  zoneId: ObjectId;
  @IsNotEmpty()
  placeId: ObjectId;
}
