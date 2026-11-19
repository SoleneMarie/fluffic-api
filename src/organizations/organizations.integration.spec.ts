import { NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Animal } from '../animals/entities/animal.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService (integration)', () => {
  let module: TestingModule;
  let organizationsService: OrganizationsService;
  let organizationRepository: Repository<Organization>;

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

        TypeOrmModule.forFeature([Organization, Animal]),
      ],
      providers: [OrganizationsService],
    }).compile();

    organizationsService =
      module.get<OrganizationsService>(OrganizationsService);

    organizationRepository = module.get<Repository<Organization>>(
      getRepositoryToken(Organization),
    );
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    await organizationRepository.deleteAll();
  });

  it('should create an organization', async () => {
    const createOrganizationDto = {
      name: 'Les Grandes Oreilles',
    };

    const organization = await organizationsService.create(
      createOrganizationDto,
    );

    expect(organization.id).toBeDefined();
    expect(organization.name).toBe('Les Grandes Oreilles');

    const savedOrganization = await organizationRepository.findOneBy({
      id: organization.id,
    });

    expect(savedOrganization).not.toBeNull();
    expect(savedOrganization?.name).toBe('Les Grandes Oreilles');
  });

  it('should return all organizations', async () => {
    await organizationRepository.save([
      organizationRepository.create({ name: 'Les Grandes Oreilles' }),
      organizationRepository.create({ name: 'Refuge du Soleil' }),
    ]);

    const organizations = await organizationsService.findAll();

    expect(organizations).toHaveLength(2);
    expect(organizations.map((organization) => organization.name)).toEqual([
      'Les Grandes Oreilles',
      'Refuge du Soleil',
    ]);
  });

  it('should return an empty array if no organizations exist', async () => {
    const organizations = await organizationsService.findAll();

    expect(organizations).toEqual([]);
  });

  it('should return an organization by id', async () => {
    const organization = await organizationRepository.save(
      organizationRepository.create({
        name: 'Les Grandes Oreilles',
      }),
    );

    const result = await organizationsService.findOne(organization.id);

    expect(result.id).toBe(organization.id);
    expect(result.name).toBe('Les Grandes Oreilles');
  });

  it('should throw NotFoundException if organization does not exist', async () => {
    await expect(organizationsService.findOne(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
