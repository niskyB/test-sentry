import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { ExpertRepository } from '../core/repositories';

@Module({
    imports: [TypeOrmModule.forFeature([ExpertRepository])],
    controllers: [ExpertController],
    providers: [ExpertService],
    exports: [ExpertService],
})
export class ExpertModule {}
