import { Test, TestingModule } from '@nestjs/testing';
import { LessonTypeService } from '../lesson-type.service';

describe('LessonTypeService', () => {
    let service: LessonTypeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LessonTypeService],
        }).compile();

        service = module.get<LessonTypeService>(LessonTypeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
