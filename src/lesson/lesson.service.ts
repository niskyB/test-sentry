import { LessonRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonService {
    constructor(private readonly lessonRepository: LessonRepository) {}
}
