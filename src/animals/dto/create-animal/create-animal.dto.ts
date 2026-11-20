import { Type } from 'class-transformer';
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

  @IsArray()
  @ArrayUnique()
  @IsEnum(AnimalTags, { each: true })
  tags: AnimalTags[];

  @IsBoolean()
  vaccinated: boolean;

  @IsBoolean()
  sterilized: boolean;

  @IsInt()
  @Min(0)
  adoptionFee: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => AnimalLocationDto)
  location: AnimalLocationDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => AnimalProfileDto)
  profile: AnimalProfileDto;
}
