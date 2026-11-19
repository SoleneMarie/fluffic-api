import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;

  const mockOrganizationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        {
          provide: OrganizationsService,
          useValue: mockOrganizationsService,
        },
      ],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all organizations', async () => {
    const organizations = [
      { id: 1, name: 'Orga 1' },
      { id: 2, name: 'Orga 2' },
    ] as Organization[];

    mockOrganizationsService.findAll.mockResolvedValue(organizations);
    const result = await controller.findAll();

    expect(mockOrganizationsService.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(organizations);
  });

  it('should return an organization by its id', async () => {
    const organization = { id: 1, name: 'Orga 1' } as Organization;

    mockOrganizationsService.findOne.mockResolvedValue(organization);
    const result = await controller.findOne(1);

    expect(mockOrganizationsService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(organization);
  });

  it('should throw a notFoundException error if no organization is found', async () => {
    mockOrganizationsService.findOne.mockRejectedValue(
      new NotFoundException('Organisation 42 introuvable'),
    );
    const result = controller.findOne(42);

    expect(mockOrganizationsService.findOne).toHaveBeenCalledWith(42);
    await expect(result).rejects.toThrow(NotFoundException);
  });

  it('should create an organization', async () => {
    const createOrganizationDto = {
      name: 'Les pinpins',
    } as CreateOrganizationDto;

    const organization = {
      id: 1,
      name: 'Les pinpins',
    } as Organization;

    mockOrganizationsService.create.mockResolvedValue(organization);

    const result = await controller.create(createOrganizationDto);

    expect(mockOrganizationsService.create).toHaveBeenCalledWith(
      createOrganizationDto,
    );
    expect(result).toEqual(organization);
  });
});
