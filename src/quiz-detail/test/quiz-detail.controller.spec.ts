import { Test, TestingModule } from '@nestjs/testing';
import { QuizDetailController } from '../quiz-detail.controller';

describe('QuizDetailController', () => {
    let controller: QuizDetailController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuizDetailController],
        }).compile();

        controller = module.get<QuizDetailController>(QuizDetailController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
