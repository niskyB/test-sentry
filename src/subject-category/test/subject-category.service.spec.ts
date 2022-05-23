import { Test, TestingModule } from '@nestjs/testing';
import { SubjectCategoryService } from '../subject-category.service';

describe('SubjectCategoryService', () => {
    let service: SubjectCategoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SubjectCategoryService],
        }).compile();

        service = module.get<SubjectCategoryService>(SubjectCategoryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
