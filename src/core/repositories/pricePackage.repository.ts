import { PricePackage } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(PricePackage)
export class PricePackageRepository extends RepositoryService<PricePackage> {}
