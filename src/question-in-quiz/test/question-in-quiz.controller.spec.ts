import { Test, TestingModule } from '@nestjs/testing';
import { QuestionInQuizController } from '../question-in-quiz.controller';

describe('QuestionInQuizController', () => {
    let controller: QuestionInQuizController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuestionInQuizController],
        }).compile();

        controller = module.get<QuestionInQuizController>(QuestionInQuizController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
