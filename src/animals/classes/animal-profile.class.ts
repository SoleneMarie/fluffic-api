import { Column } from 'typeorm';

import { AnimalSpecies } from '../../enums/animals-enums';
import {
  BudgetScore,
  EnergyScore,
  EnvironmentScore,
  LifestyleScore,
  LivingSpaceScore,
  TimeCommitmentScore,
} from '../../enums/shared-enums';

export class AnimalProfile {
  @Column({ type: 'smallint' })
  lifestyle: LifestyleScore;

  @Column({ type: 'smallint' })
  energy: EnergyScore;

  @Column({ type: 'smallint' })
  environment: EnvironmentScore;

  @Column({ type: 'smallint' })
  livingSpace: LivingSpaceScore;

  @Column({ type: 'smallint' })
  budget: BudgetScore;

  @Column({ type: 'smallint' })
  timeCommitment: TimeCommitmentScore;

  @Column({ type: 'boolean', default: false })
  goodWithChildren: boolean;

  @Column({ type: 'jsonb' })
  incompatibleSpecies: AnimalSpecies[];
}
