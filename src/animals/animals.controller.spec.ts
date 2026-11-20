import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal/create-animal.dto';
import { Animal } from './entities/animal.entity';

describe('AnimalsController', () => {
  let controller: AnimalsController;

  const mockAnimalsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimalsController],
      providers: [
        {
          provide: AnimalsService,
          useValue: mockAnimalsService,
        },
      ],
    }).compile();

    controller = module.get<AnimalsController>(AnimalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all animals', async () => {
    const animals = [
      { id: 1, name: 'Poupette' },
      { id: 2, name: 'Flocky' },
    ] as Animal[];

    mockAnimalsService.findAll.mockResolvedValue(animals);
    const result = await controller.findAll();

    expect(mockAnimalsService.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(animals);
  });

  it('should return an animal by its id', async () => {
    const animal = { id: 1, name: 'Poupette' } as Animal;

    mockAnimalsService.findOne.mockResolvedValue(animal);
    const result = await controller.findOne(1);

    expect(mockAnimalsService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(animal);
  });

  it('should throw a notFoundException error if no animal is found', async () => {
    mockAnimalsService.findOne.mockRejectedValue(
      new NotFoundException('Animal 42 introuvable'),
    );
    const result = controller.findOne(42);

    expect(mockAnimalsService.findOne).toHaveBeenCalledWith(42);
    await expect(result).rejects.toThrow(NotFoundException);
  });

  it('should create an animal', async () => {
    const createAnimalDto = {
      name: 'Poupette',
      description: 'Une adorable lapine',
    } as CreateAnimalDto;

    const animal = {
      id: 1,
      name: 'Poupette',
      description: 'Une adorable lapine',
      adopted: false,
      deleted: false,
      organization: { id: 1 },
    } as Animal;

    mockAnimalsService.create.mockResolvedValue(animal);

    const result = await controller.create(createAnimalDto);

    expect(mockAnimalsService.create).toHaveBeenCalledWith(createAnimalDto, 1);
    expect(result).toEqual(animal);
  });
});
