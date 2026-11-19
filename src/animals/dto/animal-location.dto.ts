import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class AnimalLocationDto {
  @IsString()
  @MaxLength(120)
  @IsNotEmpty()
  city: string;

  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  postalCode: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
