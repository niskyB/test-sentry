import { DimensionType } from './../models';
import { EntityRepository } from 'typeorm';
import { SystemSettingRepositoryService } from '../providers';

@EntityRepository(DimensionType)
export class DimensionTypeRepository extends SystemSettingRepositoryService<DimensionType> {}
