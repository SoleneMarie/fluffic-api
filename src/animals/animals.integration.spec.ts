import { NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  AnimalGenders,
  AnimalSpecies,
  AnimalTags,
} from '../enums/animals-enums';
import { Organization } from '../organizations/entities/organization.entity';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { Animal } from './entities/animal.entity';

describe('AnimalsService (integration)', () => {
  let module: TestingModule;
  let animalsService: AnimalsService;
  let animalRepository: Repository<Animal>;
  let organizationRepository: Repository<Organization>;

  const animalData = {
    name: 'Biscotte',
    description: 'Un adorable lapin',
    species: AnimalSpecies.RABBIT,
    gender: AnimalGenders.FEMALE,
    dateOfBirth: new Date('2025-01-15'),
    tags: [AnimalTags.CALM, AnimalTags.CUDDLY],
    vaccinated: true,
    sterilized: false,
    adoptionFee: 100,
    location: {
      city: 'Toulon',
      postalCode: '83000',
      lat: 43.1242,
      lon: 5.928,
    },
    profile: {
      lifestyle: 3,
      energy: 2,
      environment: 3,
      livingSpace: 2,
      budget: 2,
      timeCommitment: 3,
      goodWithChildren: true,
      incompatibleSpecies: [],
    },
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),

        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: Number(configService.get<string>('DB_PORT')),
            username: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASS'),
            database: configService.get<string>('DB_NAME'),
            autoLoadEntities: true,
            synchronize: true,
          }),
        }),

        TypeOrmModule.forFeature([Animal, Organization]),
      ],
      providers: [AnimalsService],
    }).compile();

    animalsService = module.get<AnimalsService>(AnimalsService);

    animalRepository = module.get<Repository<Animal>>(
      getRepositoryToken(Animal),
    );

    organizationRepository = module.get<Repository<Organization>>(
      getRepositoryToken(Organization),
    );
  });

  afterAll(async () => {
    await module.close();
  });

  let organization: Organization;

  beforeEach(async () => {
    organization = await organizationRepository.save(
      organizationRepository.create({
        name: 'Organisation de test',
      }),
    );
  });

  afterEach(async () => {
    await animalRepository.deleteAll();
    await organizationRepository.deleteAll();
  });

  it('should create an animal and associate it with an organization', async () => {
    const animal = await animalsService.create(
      animalData as CreateAnimalDto,
      organization.id,
    );

    expect(animal.id).toBeDefined();
    expect(animal.name).toBe('Biscotte');
    expect(animal.adopted).toBe(false);
    expect(animal.deleted).toBe(false);
    expect(animal.organization.id).toBe(organization.id);

    const savedAnimal = await animalRepository.findOne({
      where: { id: animal.id },
      relations: { organization: true },
    });

    expect(savedAnimal).not.toBeNull();
    expect(savedAnimal?.name).toBe('Biscotte');
    expect(savedAnimal?.organization.id).toBe(organization.id);
  });

  it('should throw NotFoundException if organization does not exist', async () => {
    await expect(
      animalsService.create(animalData as CreateAnimalDto, 999),
    ).rejects.toThrow(NotFoundException);

    const animals = await animalRepository.find();

    expect(animals).toHaveLength(0);
  });

  it('should return all animals', async () => {
    const animal1 = animalRepository.create({
      ...animalData,
      adopted: false,
      deleted: false,
      organization,
    });

    const animal2 = animalRepository.create({
      ...(animalData as CreateAnimalDto),
      name: 'Caramel',
      adopted: false,
      deleted: false,
      organization,
    });

    await animalRepository.save([animal1, animal2]);

    const animals = await animalsService.findAll();

    expect(animals).toHaveLength(2);
    expect(animals.map((animal) => animal.name)).toEqual([
      'Biscotte',
      'Caramel',
    ]);
  });

  it('should return an empty array if no animals exist', async () => {
    const animals = await animalsService.findAll();

    expect(animals).toEqual([]);
  });

  it('should return an animal by id', async () => {
    const animal = animalRepository.create({
      ...animalData,
      adopted: false,
      deleted: false,
      organization,
    });

    const savedAnimal = await animalRepository.save(animal);

    const result = await animalsService.findOne(savedAnimal.id);

    expect(result.id).toBe(savedAnimal.id);
    expect(result.name).toBe('Biscotte');
  });

  it('should throw NotFoundException if animal does not exist', async () => {
    await expect(animalsService.findOne(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
