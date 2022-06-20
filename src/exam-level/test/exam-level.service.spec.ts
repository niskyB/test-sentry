import { Test, TestingModule } from '@nestjs/testing';
import { ExamLevelService } from '../exam-level.service';

describe('ExamLevelService', () => {
    let service: ExamLevelService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ExamLevelService],
        }).compile();

        service = module.get<ExamLevelService>(ExamLevelService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
