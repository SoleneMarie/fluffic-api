import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal/create-animal.dto';
import { SearchAnimalsDto } from './dto/search-animal/search-animals.dto';
import { Animal } from './entities/animal.entity';
import { TCreateAnimalResponse } from './types';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException("Format d'image non autorisé"),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  create(
    @Body() createAnimalDto: CreateAnimalDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<TCreateAnimalResponse> {
    return this.animalsService.create(createAnimalDto, files, 1);
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
