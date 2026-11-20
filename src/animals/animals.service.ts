import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Organization } from '../organizations/entities/organization.entity';
import { CreateAnimalDto } from './dto/create-animal/create-animal.dto';
import { SearchAnimalsDto } from './dto/search-animal/search-animals.dto';
import { Animal } from './entities/animal.entity';
import { TCreateAnimalResponse } from './types';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createAnimalDto: CreateAnimalDto,
    files: Express.Multer.File[],
    organizationId: number,
  ): Promise<TCreateAnimalResponse> {
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

    const savedAnimal = await this.animalRepository.save(animal);

    const cloudinaryFolder = `fluffic/organizations/${organizationId}/animals/${savedAnimal.id}`;

    const uploadResults = await Promise.allSettled(
      files.map((file) =>
        this.cloudinaryService.uploadImage(file, cloudinaryFolder),
      ),
    );

    const uploadedImages = uploadResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    const failedUploadsCount = uploadResults.filter(
      (result) => result.status === 'rejected',
    ).length;

    savedAnimal.images = uploadedImages;

    try {
      const updatedAnimal = await this.animalRepository.save(savedAnimal);
      return {
        animal: updatedAnimal,
        failedUploadsCount,
      };
    } catch (error) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          this.cloudinaryService.deleteImage(image.publicId),
        ),
      );

      throw error;
    }
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
