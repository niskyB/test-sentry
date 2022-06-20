import { Test, TestingModule } from '@nestjs/testing';
import { QuizTypeController } from '../quiz-type.controller';

describe('QuizTypeController', () => {
    let controller: QuizTypeController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuizTypeController],
        }).compile();

        controller = module.get<QuizTypeController>(QuizTypeController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
