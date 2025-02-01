import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Markers, MarkerSchema } from './schemas/markers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Markers.name, schema: MarkerSchema }]),
  ],
  controllers: [MarkersController],
  providers: [MarkersService],
})
export class MarkersModule {}
