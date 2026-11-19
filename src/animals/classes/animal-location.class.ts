import { Column } from 'typeorm';

export class AnimalLocation {
  @Column({ type: 'varchar', length: 120 })
  city: string;

  @Column({ type: 'varchar', length: 10 })
  postalCode: string;

  @Column({ type: 'double precision' }) // Permet de recevoir directement une valeur numérique au lieu d'une string
  lat: number;

  @Column({ type: 'double precision' })
  lon: number;
}
