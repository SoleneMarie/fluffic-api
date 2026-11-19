import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  AnimalGenders,
  AnimalSpecies,
  AnimalTags,
} from '../../enums/animals-enums';
import { Organization } from '../../organizations/entities/organization.entity';
import { AnimalLocation } from '../classes/animal-location.class';
import { AnimalProfile } from '../classes/animal-profile.class';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: AnimalSpecies })
  species: AnimalSpecies;

  @Column({
    type: 'enum',
    enum: AnimalGenders,
  })
  gender: AnimalGenders;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'jsonb', default: [] })
  tags: AnimalTags[];

  @Column({ type: 'boolean', default: false })
  vaccinated: boolean;

  @Column({ type: 'boolean', default: false })
  sterilized: boolean;

  @Column({ type: 'integer', default: 0 })
  adoptionFee: number;

  @Column({ type: 'boolean', default: false })
  adopted: boolean;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @ManyToOne(() => Organization, (organization) => organization.animals, {
    nullable: false,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column(() => AnimalLocation)
  location: AnimalLocation;

  @Column(() => AnimalProfile)
  profile: AnimalProfile;
}
