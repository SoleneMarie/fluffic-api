import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import {
  AnimalGenders,
  AnimalSpecies,
  AnimalTags,
} from '../enums/animals-enums';
import { Organization } from '../organizations/entities/organization.entity';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal/create-animal.dto';
import { Animal } from './entities/animal.entity';

describe('AnimalsService', () => {
  let service: AnimalsService;

  const mockAnimalRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockOrganizationRepository = {
    findOneBy: jest.fn(),
  };

  const mockQueryBuilder = {
    andWhere: jest.fn(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockQueryBuilder.andWhere.mockReturnThis();
    mockAnimalRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsService,
        {
          provide: getRepositoryToken(Animal),
          useValue: mockAnimalRepository,
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: mockOrganizationRepository,
        },
      ],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all animals', async () => {
    const animals = [
      { id: 1, name: 'Poupette' },
      { id: 2, name: 'Oslo' },
    ] as Animal[];

    mockQueryBuilder.getMany.mockResolvedValue(animals);
    const result = await service.findAll({});

    expect(mockAnimalRepository.createQueryBuilder).toHaveBeenCalledWith(
      'animal',
    );
    expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(animals);
  });

  it('should not add any condition when no filters are provided', async () => {
    mockQueryBuilder.getMany.mockResolvedValue([]);

    await service.findAll({});

    expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
  });

  it('should filter animals by species', async () => {
    const filters = {
      species: [AnimalSpecies.CAT, AnimalSpecies.RABBIT],
    };

    mockQueryBuilder.getMany.mockResolvedValue([]);

    await service.findAll(filters);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'animal.species IN (:...species)',
      {
        species: filters.species,
      },
    );
  });

  it('should filter animals by tags', async () => {
    const filters = {
      tags: [AnimalTags.CALM, AnimalTags.CUDDLY],
    };

    mockQueryBuilder.getMany.mockResolvedValue([]);

    await service.findAll(filters);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'jsonb_exists_any(animal.tags, ARRAY[:...tags]::text[])',
      {
        tags: filters.tags,
      },
    );
  });

  it('should filter animals by gender', async () => {
    const filters = {
      gender: AnimalGenders.FEMALE,
    };

    mockQueryBuilder.getMany.mockResolvedValue([]);

    await service.findAll(filters);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'animal.gender = :gender',
      {
        gender: filters.gender,
      },
    );
  });

  it('should filter animals by geographic radius', async () => {
    const filters = {
      latitude: 43.1242,
      longitude: 5.928,
      radiusMeters: 10000,
    };

    mockQueryBuilder.getMany.mockResolvedValue([]);

    await service.findAll(filters);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(1);

    const [condition, parameters] = mockQueryBuilder.andWhere.mock.calls[0];

    expect(condition).toContain('ST_DWithin');

    expect(parameters).toEqual({
      latitude: filters.latitude,
      longitude: filters.longitude,
      radiusMeters: filters.radiusMeters,
    });
  });

  it('should combine multiple filters', async () => {
    const filters = {
      species: [AnimalSpecies.CAT],
      tags: [AnimalTags.CALM],
      gender: AnimalGenders.FEMALE,
      latitude: 43.1242,
      longitude: 5.928,
      radiusMeters: 10000,
    };

    mockQueryBuilder.getMany.mockResolvedValue([]);

    await service.findAll(filters);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(4);
    expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
  });

  it('should return an animal by its id', async () => {
    const animal = { id: 2, name: 'Oslo' } as Animal;
    mockAnimalRepository.findOneBy.mockResolvedValue(animal);

    const result = await service.findOne(2);

    expect(mockAnimalRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockAnimalRepository.findOneBy).toHaveBeenCalledWith({ id: 2 });
    expect(result).toEqual(animal);
  });

  it('should throw a notFoundException error if no animal is found', async () => {
    mockAnimalRepository.findOneBy.mockResolvedValue(null);
    const result = service.findOne(42);

    expect(mockAnimalRepository.findOneBy).toHaveBeenCalledWith({ id: 42 });
    await expect(result).rejects.toThrow(NotFoundException);
  });

  it('should create an animal', async () => {
    const createAnimalDto = {
      name: 'Poupette',
      description: 'Une adorable lapine',
    } as CreateAnimalDto;

    const organizationId = 1;

    const organization = {
      id: organizationId,
      name: 'Les Grandes Oreilles',
    } as Organization;

    const animal = {
      id: 1,
      name: 'Poupette',
      description: 'Une adorable lapine',
      adopted: false,
      deleted: false,
      organization,
    } as Animal;

    mockOrganizationRepository.findOneBy.mockResolvedValue(organization);
    mockAnimalRepository.create.mockReturnValue(animal);
    mockAnimalRepository.save.mockResolvedValue(animal);

    const result = await service.create(createAnimalDto, organizationId);

    expect(mockOrganizationRepository.findOneBy).toHaveBeenCalledWith({
      id: organizationId,
    });

    expect(mockAnimalRepository.create).toHaveBeenCalledWith({
      ...createAnimalDto,
      adopted: false,
      deleted: false,
      organization,
    });

    expect(mockAnimalRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAnimalRepository.save).toHaveBeenCalledWith(animal);

    expect(result).toEqual(animal);
  });

  it('should throw NotFoundException if organization does not exist', async () => {
    const createAnimalDto = {
      name: 'Poupette',
      description: 'Une adorable lapine',
    } as CreateAnimalDto;

    mockOrganizationRepository.findOneBy.mockResolvedValue(null);

    await expect(service.create(createAnimalDto, 999)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockAnimalRepository.create).not.toHaveBeenCalled();
    expect(mockAnimalRepository.save).not.toHaveBeenCalled();
  });
});
