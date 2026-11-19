import { IsArray, IsBoolean, IsEnum, IsInt, Max, Min } from 'class-validator';

import { AnimalSpecies } from '../../enums/animals-enums';
import {
  BudgetScore,
  EnergyScore,
  EnvironmentScore,
  LifestyleScore,
  LivingSpaceScore,
  TimeCommitmentScore,
} from '../../enums/shared-enums';

export class AnimalProfileDto {
  @IsInt()
  @Min(LifestyleScore.min)
  @Max(LifestyleScore.max)
  lifestyle: number;

  @IsInt()
  @Min(EnergyScore.min)
  @Max(EnergyScore.max)
  energy: number;

  @IsInt()
  @Min(EnvironmentScore.min)
  @Max(EnvironmentScore.max)
  environment: number;

  @IsInt()
  @Min(LivingSpaceScore.min)
  @Max(LivingSpaceScore.max)
  livingSpace: number;

  @IsInt()
  @Min(BudgetScore.min)
  @Max(BudgetScore.max)
  budget: number;

  @IsInt()
  @Min(TimeCommitmentScore.min)
  @Max(TimeCommitmentScore.max)
  timeCommitment: number;

  @IsBoolean()
  goodWithChildren: boolean;

  @IsArray()
  @IsEnum(AnimalSpecies, { each: true })
  incompatibleSpecies: AnimalSpecies[];
}
