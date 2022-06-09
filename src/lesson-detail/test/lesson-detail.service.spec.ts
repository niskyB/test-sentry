import { Test, TestingModule } from '@nestjs/testing';
import { LessonDetailService } from '../lesson-detail.service';

describe('LessonDetailService', () => {
    let service: LessonDetailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LessonDetailService],
        }).compile();

        service = module.get<LessonDetailService>(LessonDetailService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
