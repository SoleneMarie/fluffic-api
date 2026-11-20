import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { Animal } from '../src/animals/entities/animal.entity';
import { AppModule } from '../src/app.module';
import { CloudinaryService } from '../src/cloudinary/cloudinary.service';
import { configureApp } from '../src/common/config/configure-app';
import {
  AnimalGenders,
  AnimalSpecies,
  AnimalTags,
} from '../src/enums/animals-enums';
import { Organization } from '../src/organizations/entities/organization.entity';

/**
 * TODO (Authentification) :
 * - Récupérer l'organisation de l'utilisateur authentifié à partir de son JWT.
 * - Transmettre l'identifiant de l'organisation à AnimalsService.create()
 *   au lieu d'utiliser l'identifiant temporaire codé en dur.
 * - Ajouter des tests E2E pour la création d'un animal par un utilisateur authentifié.
 * - Vérifier qu'un utilisateur non authentifié ne peut pas créer d'animal.
 * - Vérifier qu'un animal est toujours associé à l'organisation de l'utilisateur authentifié.
 * - Vérifier la création d'un animal avec et sans images
 */

describe('Animals (e2e)', () => {
  let app: INestApplication;
  let organizationRepository: Repository<Organization>;
  let animalRepository: Repository<Animal>;
  let organization: Organization;

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
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CloudinaryService)
      .useValue({
        uploadImage: jest.fn(),
        deleteImage: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    organizationRepository = app.get<Repository<Organization>>(
      getRepositoryToken(Organization),
    );

    animalRepository = app.get<Repository<Animal>>(getRepositoryToken(Animal));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    organization = await organizationRepository.save(
      organizationRepository.create({
        name: 'Les Grandes Oreilles',
      }),
    );
  });

  afterEach(async () => {
    await animalRepository.deleteAll();
    await organizationRepository.deleteAll();
  });

  it('GET /animals - should return all animals', async () => {
    const animal1 = animalRepository.create({
      ...animalData,
      adopted: false,
      deleted: false,
      organization,
    });

    const animal2 = animalRepository.create({
      ...animalData,
      name: 'Caramel',
      adopted: false,
      deleted: false,
      organization,
    });

    await animalRepository.save([animal1, animal2]);

    const response = await request(app.getHttpServer())
      .get('/animals')
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body.map((animal: Animal) => animal.name)).toEqual([
      'Biscotte',
      'Caramel',
    ]);
  });

  it('GET /animals - should return an empty array if no animals exist', async () => {
    const response = await request(app.getHttpServer())
      .get('/animals')
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('GET /animals - should filter animals by species and gender', async () => {
    const rabbit = animalRepository.create({
      ...animalData,
      name: 'Biscotte',
      species: AnimalSpecies.RABBIT,
      gender: AnimalGenders.FEMALE,
      adopted: false,
      deleted: false,
      organization,
    });

    const cat = animalRepository.create({
      ...animalData,
      name: 'Minette',
      species: AnimalSpecies.CAT,
      gender: AnimalGenders.FEMALE,
      adopted: false,
      deleted: false,
      organization,
    });

    const maleRabbit = animalRepository.create({
      ...animalData,
      name: 'Caramel',
      species: AnimalSpecies.RABBIT,
      gender: AnimalGenders.MALE,
      adopted: false,
      deleted: false,
      organization,
    });

    await animalRepository.save([rabbit, cat, maleRabbit]);

    const response = await request(app.getHttpServer())
      .get('/animals')
      .query({
        species: AnimalSpecies.RABBIT,
        gender: AnimalGenders.FEMALE,
      })
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Biscotte');
  });

  it('GET /animals - should filter animals by geographic radius', async () => {
    const nearbyRabbit = animalRepository.create({
      ...animalData,
      name: 'Biscotte',
      location: {
        city: 'Toulon',
        postalCode: '83000',
        lat: 43.1242,
        lon: 5.928,
      },
      adopted: false,
      deleted: false,
      organization,
    });

    const distantRabbit = animalRepository.create({
      ...animalData,
      name: 'Caramel',
      location: {
        city: 'Marseille',
        postalCode: '13000',
        lat: 43.2965,
        lon: 5.3698,
      },
      adopted: false,
      deleted: false,
      organization,
    });

    await animalRepository.save([nearbyRabbit, distantRabbit]);

    const response = await request(app.getHttpServer())
      .get('/animals')
      .query({
        latitude: 43.1242,
        longitude: 5.928,
        radiusMeters: 1000,
      })
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Biscotte');
  });

  it('GET /animals/:id - should return an animal by id', async () => {
    const animal = animalRepository.create({
      ...animalData,
      adopted: false,
      deleted: false,
      organization,
    });

    const savedAnimal = await animalRepository.save(animal);

    const response = await request(app.getHttpServer())
      .get(`/animals/${savedAnimal.id}`)
      .expect(200);

    expect(response.body.id).toBe(savedAnimal.id);
    expect(response.body.name).toBe('Biscotte');
  });

  it('GET /animals/:id - should return 404 if animal does not exist', async () => {
    await request(app.getHttpServer()).get('/animals/999999').expect(404);
  });

  it('POST /animals - should return 400 if DTO is invalid', async () => {
    await request(app.getHttpServer()).post('/animals').send({}).expect(400);
  });
});
