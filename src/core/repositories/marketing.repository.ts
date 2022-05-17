import { Marketing } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Marketing)
export class MarketingRepository extends RepositoryService<Marketing> {}
