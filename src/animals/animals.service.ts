import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Organization } from '../organizations/entities/organization.entity';
import { CreateAnimalDto } from './dto/create-animal/create-animal.dto';
import { SearchAnimalsDto } from './dto/search-animal/search-animals.dto';
import { Animal } from './entities/animal.entity';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(
    createAnimalDto: CreateAnimalDto,
    organizationId: number,
  ): Promise<Animal> {
    const organization = await this.organizationRepository.findOneBy({
      id: organizationId,
    });

    if (!organization) {
      throw new NotFoundException(`Organisation ${organizationId} introuvable`);
    }

    const animal = this.animalRepository.create({
      ...createAnimalDto,
      adopted: false,
      deleted: false,
      organization,
    });
    return this.animalRepository.save(animal);
  }

  async findAll(filters: SearchAnimalsDto): Promise<Animal[]> {
    const query = this.animalRepository.createQueryBuilder('animal');

    if (filters.species?.length) {
      query.andWhere('animal.species IN (:...species)', {
        species: filters.species,
      });
    }

    if (filters.tags?.length) {
      query.andWhere('jsonb_exists_any(animal.tags, ARRAY[:...tags]::text[])', {
        tags: filters.tags,
      });
    }

    if (filters.gender) {
      query.andWhere('animal.gender = :gender', {
        gender: filters.gender,
      });
    }

    if (
      filters.latitude !== undefined &&
      filters.longitude !== undefined &&
      filters.radiusMeters !== undefined
    ) {
      const { latitude, longitude, radiusMeters } = filters;

      const searchPoint = `
        ST_SetSRID(
          ST_MakePoint(:longitude, :latitude),
          4326
        )::geography
      `;

      const animalPoint = `
        ST_SetSRID(
          ST_MakePoint(animal.locationLon, animal.locationLat),
          4326
        )::geography
      `;

      query.andWhere(
        `
          ST_DWithin(
          ${animalPoint},
          ${searchPoint},
          :radiusMeters
        )`,
        {
          latitude,
          longitude,
          radiusMeters,
        },
      );
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Animal> {
    const animal = await this.animalRepository.findOneBy({ id });
    if (!animal) {
      throw new NotFoundException(`Animal ${id} introuvable`);
    }
    return animal;
  }
}
