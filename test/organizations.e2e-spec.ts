import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from '../src/app.module';
import { configureApp } from '../src/common/config/configure-app';
import { Organization } from '../src/organizations/entities/organization.entity';

describe('Organizations (e2e)', () => {
  let app: INestApplication;

  let organizationRepository: Repository<Organization>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    configureApp(app);

    await app.init();

    organizationRepository = app.get<Repository<Organization>>(
      getRepositoryToken(Organization),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await organizationRepository.deleteAll();
  });

  it('/organizations (POST)', async () => {
    return request(app.getHttpServer())
      .post('/organizations')
      .send({
        name: 'Les Grandes Oreilles',
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe('Les Grandes Oreilles');
      });
  });

  it('/organizations (GET)', async () => {
    await request(app.getHttpServer())
      .post('/organizations')
      .send({ name: 'Les Grandes Oreilles' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/organizations')
      .send({ name: 'Refuge du Soleil' })
      .expect(201);

    return request(app.getHttpServer())
      .get('/organizations')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveLength(2);

        expect(
          response.body.map((organization: Organization) => organization.name),
        ).toEqual(['Les Grandes Oreilles', 'Refuge du Soleil']);
      });
  });

  it('/organizations/:id (GET)', async () => {
    const creationResponse = await request(app.getHttpServer())
      .post('/organizations')
      .send({ name: 'Les Grandes Oreilles' })
      .expect(201);

    const organizationId = creationResponse.body.id;

    return request(app.getHttpServer())
      .get(`/organizations/${organizationId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.id).toBe(organizationId);
        expect(response.body.name).toBe('Les Grandes Oreilles');
      });
  });
});
