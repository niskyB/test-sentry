import { Test, TestingModule } from '@nestjs/testing';
import { SubjectCategoryController } from '../subject-category.controller';

describe('SubjectCategoryController', () => {
    let controller: SubjectCategoryController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubjectCategoryController],
        }).compile();

        controller = module.get<SubjectCategoryController>(SubjectCategoryController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
