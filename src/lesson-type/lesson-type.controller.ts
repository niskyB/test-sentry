import { Controller } from '@nestjs/common';
import { LessonTypeService } from './lesson-type.service';

@Controller('lesson-type')
export class LessonTypeController {
    constructor(private readonly lessonTypeService: LessonTypeService) {}
}
