import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';
import { Lesson } from '../models';

@EntityRepository(Lesson)
export class LessonRepository extends RepositoryService<Lesson> {}
