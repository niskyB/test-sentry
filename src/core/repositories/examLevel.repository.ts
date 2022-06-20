import { ExamLevel } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(ExamLevel)
export class ExamLevelRepository extends RepositoryService<ExamLevel> {}
