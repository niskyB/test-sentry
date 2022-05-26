import { Test, TestingModule } from '@nestjs/testing';
import { LessonTypeController } from '../lesson-type.controller';

describe('LessonTypeController', () => {
    let controller: LessonTypeController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LessonTypeController],
        }).compile();

        controller = module.get<LessonTypeController>(LessonTypeController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
