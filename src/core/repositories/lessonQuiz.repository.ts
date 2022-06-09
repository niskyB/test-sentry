import { LessonQuiz } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(LessonQuiz)
export class LessonQuizRepository extends RepositoryService<LessonQuiz> {}
