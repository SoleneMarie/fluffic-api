import { Animal } from './entities/animal.entity';

export type TCreateAnimalResponse = {
  animal: Animal;
  failedUploadsCount: number;
};
