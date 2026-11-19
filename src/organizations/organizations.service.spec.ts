import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService', () => {
  let service: OrganizationsService;

  const mockOrganizationRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: getRepositoryToken(Organization),
          useValue: mockOrganizationRepository,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all organizations', async () => {
    const organizations = [
      { id: 1, name: 'Association des Papichats' },
      { id: 2, name: "Les lapins d'Elisa" },
    ] as Organization[];

    mockOrganizationRepository.find.mockResolvedValue(organizations);

    const result = await service.findAll();

    expect(mockOrganizationRepository.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(organizations);
  });

  it('should return one organization by its id', async () => {
    const organization = {
      id: 1,
      name: 'Association des Papichats',
    } as Organization;
    mockOrganizationRepository.findOneBy.mockResolvedValue(organization);

    const result = await service.findOne(1);

    expect(mockOrganizationRepository.findOneBy).toHaveBeenCalledWith({
      id: 1,
    });
    expect(result).toEqual(organization);
  });

  it('should throw a notFoundException error if no organization is found', async () => {
    mockOrganizationRepository.findOneBy.mockResolvedValue(null);
    const result = service.findOne(50);

    expect(mockOrganizationRepository.findOneBy).toHaveBeenCalledWith({
      id: 50,
    });
    await expect(result).rejects.toThrow(NotFoundException);
  });

  it('should create an organization', async () => {
    const createOrganizationDto = {
      name: 'Association des Papichats',
    } as CreateOrganizationDto;

    const organization = {
      id: 1,
      name: 'Association des Papichats',
    } as Organization;

    mockOrganizationRepository.create.mockReturnValue(organization);
    mockOrganizationRepository.save.mockResolvedValue(organization);

    const result = await service.create(createOrganizationDto);

    expect(mockOrganizationRepository.create).toHaveBeenCalledWith(
      createOrganizationDto,
    );
    expect(mockOrganizationRepository.save).toHaveBeenCalledWith(organization);
    expect(result).toEqual(organization);
  });
});
