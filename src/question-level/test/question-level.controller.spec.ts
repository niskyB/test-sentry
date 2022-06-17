import { Test, TestingModule } from '@nestjs/testing';
import { QuestionLevelController } from '../question-level.controller';

describe('QuestionLevelController', () => {
    let controller: QuestionLevelController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuestionLevelController],
        }).compile();

        controller = module.get<QuestionLevelController>(QuestionLevelController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
