import { Dimension } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Dimension)
export class DimensionRepository extends RepositoryService<Dimension> {}
