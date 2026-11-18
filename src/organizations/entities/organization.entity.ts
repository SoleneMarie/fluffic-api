import { Column, Entity, OneToMany,PrimaryGeneratedColumn } from 'typeorm';

import { Animal } from '../../animals/entities/animal.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  @OneToMany(() => Animal, (animal) => animal.organization)
  animals: Animal[];
}
