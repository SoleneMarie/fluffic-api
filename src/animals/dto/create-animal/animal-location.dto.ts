import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class AnimalLocationDto {
  @IsString()
  @MaxLength(120)
  @IsNotEmpty()
  city: string;

  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  postalCode: string;

  @Type(() => Number)
  @IsNumber()
  lat: number;

  @Type(() => Number)
  @IsNumber()
  lon: number;
}
