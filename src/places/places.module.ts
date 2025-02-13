import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from './schemas/place.schema';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/configs/multer-config.service';
import { MarkersModule } from 'src/markers/markers.module';
import { Province, ProvinceSchema } from './schemas/province.schema';
import { Geography, GeographySchema } from './schemas/geography.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema },
      { name: Province.name, schema: ProvinceSchema },
      { name: Geography.name, schema: GeographySchema },
    ]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    MarkersModule,
  ],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
