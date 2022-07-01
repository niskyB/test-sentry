import { Test, TestingModule } from '@nestjs/testing';
import { SystemMenuService } from '../system-menu.service';

describe('SystemMenuService', () => {
    let service: SystemMenuService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SystemMenuService],
        }).compile();

        service = module.get<SystemMenuService>(SystemMenuService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
