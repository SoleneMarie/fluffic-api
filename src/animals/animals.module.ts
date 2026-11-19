import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Organization } from '../organizations/entities/organization.entity';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { Animal } from './entities/animal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, Organization])],
  controllers: [AnimalsController],
  providers: [AnimalsService],
})
export class AnimalsModule {}
