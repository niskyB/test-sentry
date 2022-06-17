import { Test, TestingModule } from '@nestjs/testing';
import { QuestionLevelService } from '../question-level.service';

describe('QuestionLevelService', () => {
    let service: QuestionLevelService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QuestionLevelService],
        }).compile();

        service = module.get<QuestionLevelService>(QuestionLevelService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
