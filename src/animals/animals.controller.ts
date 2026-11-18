import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { Body, Get, Post } from '@nestjs/common';

import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { Animal } from './entities/animal.entity';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto): Promise<Animal> {
    return this.animalsService.create(createAnimalDto, 1);
  }

  @Get()
  findAll(): Promise<Animal[]> {
    return this.animalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Animal> {
    return this.animalsService.findOne(id);
  }
}
