import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateOrganizationDto } from './create-organization.dto';

describe('CreateOrganizationDto', () => {
  it('should reject a name that is not a string', async () => {
    const dto = plainToInstance(CreateOrganizationDto, {
      name: 123,
    });

    const errors = await validate(dto);

    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should reject an empty name', async () => {
    const dto = plainToInstance(CreateOrganizationDto, {
      name: '',
    });

    const errors = await validate(dto);

    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should reject a name longer than 200 characters', async () => {
    const dto = plainToInstance(CreateOrganizationDto, {
      name: 'A'.repeat(201),
    });

    const errors = await validate(dto);

    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should accept a valid organization name', async () => {
    const dto = plainToInstance(CreateOrganizationDto, {
      name: 'Les Grandes Oreilles',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});
