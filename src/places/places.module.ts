import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from './schemas/place.shema';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/configs/multer-config.service';
import { MarkersModule } from 'src/markers/markers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    MarkersModule,
  ],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
