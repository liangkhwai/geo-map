import { PartialType } from '@nestjs/mapped-types';
import { CreateMarkerDto } from './create-marker.dto';

export class UpdateMarkerDto extends PartialType(CreateMarkerDto) {}
