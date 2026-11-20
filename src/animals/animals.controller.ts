import { Controller, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Body, Get, Post } from '@nestjs/common';

import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal/create-animal.dto';
import { SearchAnimalsDto } from './dto/search-animal/search-animals.dto';
import { Animal } from './entities/animal.entity';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto): Promise<Animal> {
    return this.animalsService.create(createAnimalDto, 1);
  }

  @Get()
  findAll(@Query() filters: SearchAnimalsDto): Promise<Animal[]> {
    return this.animalsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Animal> {
    return this.animalsService.findOne(id);
  }
}
