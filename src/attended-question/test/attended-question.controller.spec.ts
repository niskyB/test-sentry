import { Test, TestingModule } from '@nestjs/testing';
import { AttendedQuestionController } from '../attended-question.controller';

describe('AttendedQuestionController', () => {
    let controller: AttendedQuestionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AttendedQuestionController],
        }).compile();

        controller = module.get<AttendedQuestionController>(AttendedQuestionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
