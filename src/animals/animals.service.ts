import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAnimalDto } from './dto/create-animal.dto';
import { Animal } from './entities/animal.entity';
@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async create(
    createAnimalDto: CreateAnimalDto,
    organizationId: number,
  ): Promise<Animal> {
    const animal = this.animalRepository.create({
      ...createAnimalDto,
      adopted: false,
      deleted: false,
      organization: { id: organizationId },
    });
    return this.animalRepository.save(animal);
  }

  findAll(): Promise<Animal[]> {
    return this.animalRepository.find();
  }

  async findOne(id: number): Promise<Animal> {
    const animal = await this.animalRepository.findOneBy({ id });
    if (!animal) {
      throw new NotFoundException(`Animal ${id} introuvable`);
    }
    return animal;
  }
}
