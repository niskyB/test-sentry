import { Test, TestingModule } from '@nestjs/testing';
import { LessonDetailController } from '../lesson-detail.controller';

describe('LessonDetailController', () => {
    let controller: LessonDetailController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LessonDetailController],
        }).compile();

        controller = module.get<LessonDetailController>(LessonDetailController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
