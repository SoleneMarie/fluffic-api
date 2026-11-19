import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import {
  AnimalGenders,
  AnimalSpecies,
  AnimalTags,
} from '../../enums/animals-enums';
import {
  BudgetScore,
  EnergyScore,
  EnvironmentScore,
  LifestyleScore,
  LivingSpaceScore,
  TimeCommitmentScore,
} from '../../enums/shared-enums';
import { CreateAnimalDto } from './create-animal.dto';

describe('CreateAnimalDto', () => {
  it.each(['name', 'description'] as const)(
    'should reject an empty value for %s',
    async (property) => {
      const dto = plainToInstance(CreateAnimalDto, {
        [property]: '',
      });

      const errors = await validate(dto);
      const propertyError = errors.find((error) => error.property === property);

      expect(propertyError?.constraints).toHaveProperty('isNotEmpty');
    },
  );

  it('should reject a name that is too long', async () => {
    const longName = 'A'.repeat(121);
    const dto = plainToInstance(CreateAnimalDto, {
      name: longName,
    });

    const errors = await validate(dto);
    const nameError = errors.find((error) => error.property === 'name');

    expect(nameError).toBeDefined();
    expect(nameError?.constraints).toHaveProperty('maxLength');
  });

  it('should reject an invalid species', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      species: 'dragon',
    });

    const errors = await validate(dto);
    const speciesError = errors.find((error) => error.property === 'species');

    expect(speciesError?.constraints).toHaveProperty('isEnum');
  });

  it('should reject an invalid gender', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      gender: 'unknown',
    });

    const errors = await validate(dto);
    const genderError = errors.find((error) => error.property === 'gender');

    expect(genderError?.constraints).toHaveProperty('isEnum');
  });

  it('should reject an invalid date of birth', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      dateOfBirth: 'not-a-date',
    });

    const errors = await validate(dto);
    const dateError = errors.find((error) => error.property === 'dateOfBirth');

    expect(dateError?.constraints).toHaveProperty('isDate');
  });

  it('should reject tags when the value is not an array', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      tags: 'affectionate',
    });

    const errors = await validate(dto);
    const tagsError = errors.find((error) => error.property === 'tags');

    expect(tagsError?.constraints).toHaveProperty('isArray');
  });

  it('should reject duplicate tags', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      tags: ['affectionate', 'affectionate'],
    });

    const errors = await validate(dto);
    const tagsError = errors.find((error) => error.property === 'tags');

    expect(tagsError?.constraints).toHaveProperty('arrayUnique');
  });

  it.each(['vaccinated', 'sterilized'] as const)(
    'should reject a non-boolean value for %s',
    async (property) => {
      const dto = plainToInstance(CreateAnimalDto, {
        [property]: 'yes',
      });

      const errors = await validate(dto);
      const propertyError = errors.find((error) => error.property === property);

      expect(propertyError?.constraints).toHaveProperty('isBoolean');
    },
  );

  it('should reject a negative adoption fee', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      adoptionFee: -10,
    });

    const errors = await validate(dto);
    const feeError = errors.find((error) => error.property === 'adoptionFee');

    expect(feeError?.constraints).toHaveProperty('min');
  });

  it('should reject a decimal adoption fee', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      adoptionFee: 12.5,
    });

    const errors = await validate(dto);
    const feeError = errors.find((error) => error.property === 'adoptionFee');

    expect(feeError?.constraints).toHaveProperty('isInt');
  });

  it.each([
    ['lifestyle', LifestyleScore.min - 1, 'min'],
    ['energy', EnergyScore.max + 1, 'max'],
    ['environment', 2.5, 'isInt'],
    ['livingSpace', LivingSpaceScore.min - 1, 'min'],
    ['budget', BudgetScore.max + 1, 'max'],
    ['timeCommitment', 2.5, 'isInt'],
  ] as const)(
    'should reject an invalid %s score',
    async (property, value, constraint) => {
      const dto = plainToInstance(CreateAnimalDto, {
        profile: {
          [property]: value,
        },
      });

      const errors = await validate(dto);

      const profileError = errors.find((error) => error.property === 'profile');

      const propertyError = profileError?.children?.find(
        (error) => error.property === property,
      );

      expect(propertyError?.constraints).toHaveProperty(constraint);
    },
  );

  it('should reject a non-boolean goodWithChildren value', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      profile: {
        goodWithChildren: 'yes',
      },
    });

    const errors = await validate(dto);

    const profileError = errors.find((error) => error.property === 'profile');

    const propertyError = profileError?.children?.find(
      (error) => error.property === 'goodWithChildren',
    );

    expect(propertyError?.constraints).toHaveProperty('isBoolean');
  });

  it('should reject an invalid tag', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      tags: ['dragon'],
    });

    const errors = await validate(dto);
    const tagsError = errors.find((error) => error.property === 'tags');

    expect(tagsError?.constraints).toHaveProperty('isEnum');
  });

  it('should reject incompatibleSpecies when the value is not an array', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      profile: {
        incompatibleSpecies: 'cat',
      },
    });

    const errors = await validate(dto);

    const profileError = errors.find((error) => error.property === 'profile');

    const propertyError = profileError?.children?.find(
      (error) => error.property === 'incompatibleSpecies',
    );

    expect(propertyError?.constraints).toHaveProperty('isArray');
  });

  it('should reject an invalid species in incompatibleSpecies', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      profile: {
        incompatibleSpecies: ['dragon'],
      },
    });

    const errors = await validate(dto);

    const profileError = errors.find((error) => error.property === 'profile');

    const propertyError = profileError?.children?.find(
      (error) => error.property === 'incompatibleSpecies',
    );

    expect(propertyError?.constraints).toHaveProperty('isEnum');
  });

  it('should reject a city that is too long', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      location: {
        city: 'A'.repeat(121),
      },
    });

    const errors = await validate(dto);

    const locationError = errors.find((error) => error.property === 'location');

    const cityError = locationError?.children?.find(
      (error) => error.property === 'city',
    );

    expect(cityError?.constraints).toHaveProperty('maxLength');
  });

  it('should reject an empty postalCode', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      location: {
        postalCode: '',
      },
    });

    const errors = await validate(dto);

    const locationError = errors.find((error) => error.property === 'location');

    const postalCodeError = locationError?.children?.find(
      (error) => error.property === 'postalCode',
    );

    expect(postalCodeError?.constraints).toHaveProperty('isNotEmpty');
  });

  it('should reject a postalCode that is too long', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      location: {
        postalCode: '12345678901',
      },
    });

    const errors = await validate(dto);

    const locationError = errors.find((error) => error.property === 'location');

    const postalCodeError = locationError?.children?.find(
      (error) => error.property === 'postalCode',
    );

    expect(postalCodeError?.constraints).toHaveProperty('maxLength');
  });

  it.each(['lat', 'lon'] as const)(
    'should reject a non-numeric value for %s',
    async (property) => {
      const dto = plainToInstance(CreateAnimalDto, {
        location: {
          [property]: 'invalid',
        },
      });

      const errors = await validate(dto);

      const locationError = errors.find(
        (error) => error.property === 'location',
      );

      const propertyError = locationError?.children?.find(
        (error) => error.property === property,
      );

      expect(propertyError?.constraints).toHaveProperty('isNumber');
    },
  );

  it('should accept a valid animal', async () => {
    const dto = plainToInstance(CreateAnimalDto, {
      name: 'Poupette',
      description: 'Une adorable lapine',
      species: AnimalSpecies.RABBIT,
      gender: AnimalGenders.FEMALE,
      dateOfBirth: '2025-01-15',
      tags: [AnimalTags.AFFECTIONATE],
      vaccinated: true,
      sterilized: false,
      adoptionFee: 50,
      location: {
        city: 'Toulon',
        postalCode: '83000',
        lat: 43.1242,
        lon: 5.928,
      },
      profile: {
        lifestyle: LifestyleScore.min,
        energy: EnergyScore.min,
        environment: EnvironmentScore.min,
        livingSpace: LivingSpaceScore.min,
        budget: BudgetScore.min,
        timeCommitment: TimeCommitmentScore.min,
        goodWithChildren: true,
        incompatibleSpecies: [AnimalSpecies.DOG],
      },
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});
