import { Module } from '@nestjs/common';
import { ConfigModule ,ConfigService} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PlacesModule } from './places/places.module';
import { MarkersModule } from './markers/markers.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    UsersModule,
    PlacesModule,
    MarkersModule,
  ],
})
export class AppModule {}
