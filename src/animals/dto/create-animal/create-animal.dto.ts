import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import {
  AnimalGenders,
  AnimalSpecies,
  AnimalTags,
} from '../../../enums/animals-enums';
import { AnimalLocationDto } from './animal-location.dto';
import { AnimalProfileDto } from './animal-profile.dto';

export class CreateAnimalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(AnimalSpecies)
  species: AnimalSpecies;

  @IsEnum(AnimalGenders)
  gender: AnimalGenders;

  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return JSON.parse(value);
  })
  @IsArray()
  @ArrayUnique()
  @IsEnum(AnimalTags, { each: true })
  tags: AnimalTags[];

  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return value;
  })
  @IsBoolean()
  vaccinated: boolean;

  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return value;
  })
  @IsBoolean()
  sterilized: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  adoptionFee: number;

  @IsDefined()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return plainToInstance(AnimalLocationDto, JSON.parse(value));
    }

    return plainToInstance(AnimalLocationDto, value);
  })
  @ValidateNested()
  location: AnimalLocationDto;

  @IsDefined()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return plainToInstance(AnimalProfileDto, JSON.parse(value));
    }

    return plainToInstance(AnimalProfileDto, value);
  })
  @ValidateNested()
  profile: AnimalProfileDto;
}
