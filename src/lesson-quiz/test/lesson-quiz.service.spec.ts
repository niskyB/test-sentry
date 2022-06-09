import { Test, TestingModule } from '@nestjs/testing';
import { LessonQuizService } from '../lesson-quiz.service';

describe('LessonQuizService', () => {
    let service: LessonQuizService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LessonQuizService],
        }).compile();

        service = module.get<LessonQuizService>(LessonQuizService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
