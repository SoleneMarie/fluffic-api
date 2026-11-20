import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AnimalSpecies, AnimalTags } from '../../../enums/animals-enums';
import { SearchAnimalsDto } from './search-animals.dto';

describe('SearchAnimalsDto', () => {
  it('should accept an empty object', async () => {
    const dto = plainToInstance(SearchAnimalsDto, {});

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should accept a valid location', async () => {
    const dto = plainToInstance(SearchAnimalsDto, {
      latitude: 43.1242,
      longitude: 5.928,
      radiusMeters: 10000,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should reject an invalid latitude', async () => {
    const dto = plainToInstance(SearchAnimalsDto, {
      latitude: 120,
      longitude: 5.928,
      radiusMeters: 10000,
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should reject an incomplete location', async () => {
    const dto = plainToInstance(SearchAnimalsDto, {
      latitude: 43.1242,
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  describe('enum validations', () => {
    it.each([
      ['species', { species: ['DRAGON'] }],
      ['gender', { gender: 'UNKNOWN' }],
      ['tags', { tags: ['INVISIBLE'] }],
    ])('should reject an invalid %s', async (_, data) => {
      const dto = plainToInstance(SearchAnimalsDto, data);

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('valid enum arrays', () => {
    it.each([
      ['species', { species: [AnimalSpecies.CAT, AnimalSpecies.RABBIT] }],
      ['tags', { tags: [AnimalTags.CALM, AnimalTags.CUDDLY] }],
    ])('should accept a valid array of %s', async (_, data) => {
      const dto = plainToInstance(SearchAnimalsDto, data);

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
