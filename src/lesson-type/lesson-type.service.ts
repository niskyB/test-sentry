import { LessonTypeRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonTypeService {
    constructor(private readonly lessonTypeRepository: LessonTypeRepository) {}
}
