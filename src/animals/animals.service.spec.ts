import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Organization } from '../organizations/entities/organization.entity';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { Animal } from './entities/animal.entity';

describe('AnimalsService', () => {
  let service: AnimalsService;

  const mockAnimalRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockOrganizationRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

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

    mockAnimalRepository.find.mockResolvedValue(animals);
    const result = await service.findAll();

    expect(mockAnimalRepository.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(animals);
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
