import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

import {
  AnimalGenders,
  AnimalSpecies,
  AnimalTags,
} from '../../../enums/animals-enums';

export class SearchAnimalsDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) {
      return value;
    }

    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsEnum(AnimalSpecies, { each: true })
  species?: AnimalSpecies[];

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) {
      return value;
    }

    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsEnum(AnimalTags, { each: true })
  tags?: AnimalTags[];

  @IsOptional()
  @IsEnum(AnimalGenders)
  gender?: AnimalGenders;

  @ValidateIf(
    (dto) =>
      dto.latitude !== undefined ||
      dto.longitude !== undefined ||
      dto.radiusMeters !== undefined,
  )
  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ValidateIf(
    (dto) =>
      dto.latitude !== undefined ||
      dto.longitude !== undefined ||
      dto.radiusMeters !== undefined,
  )
  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ValidateIf(
    (dto) =>
      dto.latitude !== undefined ||
      dto.longitude !== undefined ||
      dto.radiusMeters !== undefined,
  )
  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200000)
  radiusMeters?: number;
}
