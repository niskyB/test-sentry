import { ExamLevelRepository } from './../core/repositories';
import { ExamLevel } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ExamLevelController } from './exam-level.controller';
import { ExamLevelService } from './exam-level.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ExamLevel])],
    controllers: [ExamLevelController],
    providers: [ExamLevelService, { provide: ExamLevelRepository, useFactory: (connection: Connection) => connection.getCustomRepository(ExamLevelRepository), inject: [Connection] }],
    exports: [ExamLevelService],
})
export class ExamLevelModule {}
