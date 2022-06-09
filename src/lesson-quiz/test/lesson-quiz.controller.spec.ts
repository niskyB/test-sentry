import { Test, TestingModule } from '@nestjs/testing';
import { LessonQuizController } from '../lesson-quiz.controller';

describe('LessonQuizController', () => {
    let controller: LessonQuizController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LessonQuizController],
        }).compile();

        controller = module.get<LessonQuizController>(LessonQuizController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
