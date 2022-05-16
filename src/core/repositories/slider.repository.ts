import { Slider } from './../models/slider';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Slider)
export class SliderRepository extends RepositoryService<Slider> {}
