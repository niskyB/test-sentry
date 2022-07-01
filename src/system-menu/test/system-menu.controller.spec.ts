import { Test, TestingModule } from '@nestjs/testing';
import { SystemMenuController } from '../system-menu.controller';

describe('SystemMenuController', () => {
    let controller: SystemMenuController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SystemMenuController],
        }).compile();

        controller = module.get<SystemMenuController>(SystemMenuController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
