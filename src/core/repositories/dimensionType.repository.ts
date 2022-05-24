import { DimensionType } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(DimensionType)
export class DimensionTypeRepository extends RepositoryService<DimensionType> {}
