import { Test, TestingModule } from '@nestjs/testing';
import { ExamLevelController } from '../exam-level.controller';

describe('ExamLevelController', () => {
    let controller: ExamLevelController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExamLevelController],
        }).compile();

        controller = module.get<ExamLevelController>(ExamLevelController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
