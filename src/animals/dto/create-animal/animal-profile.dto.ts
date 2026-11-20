import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, Max, Min } from 'class-validator';

import { AnimalSpecies } from '../../../enums/animals-enums';
import {
  BudgetScore,
  EnergyScore,
  EnvironmentScore,
  LifestyleScore,
  LivingSpaceScore,
  TimeCommitmentScore,
} from '../../../enums/shared-enums';

export class AnimalProfileDto {
  @Type(() => Number)
  @IsInt()
  @Min(LifestyleScore.min)
  @Max(LifestyleScore.max)
  lifestyle: number;

  @Type(() => Number)
  @IsInt()
  @Min(EnergyScore.min)
  @Max(EnergyScore.max)
  energy: number;

  @Type(() => Number)
  @IsInt()
  @Min(EnvironmentScore.min)
  @Max(EnvironmentScore.max)
  environment: number;

  @Type(() => Number)
  @IsInt()
  @Min(LivingSpaceScore.min)
  @Max(LivingSpaceScore.max)
  livingSpace: number;

  @Type(() => Number)
  @IsInt()
  @Min(BudgetScore.min)
  @Max(BudgetScore.max)
  budget: number;

  @Type(() => Number)
  @IsInt()
  @Min(TimeCommitmentScore.min)
  @Max(TimeCommitmentScore.max)
  timeCommitment: number;

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
  goodWithChildren: boolean;

  @IsArray()
  @IsEnum(AnimalSpecies, { each: true })
  incompatibleSpecies: AnimalSpecies[];
}
