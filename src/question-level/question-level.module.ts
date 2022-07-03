import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { QuestionLevelsController } from './question-levels.controller';
import { QuestionLevelRepository } from './../core/repositories';
import { QuestionLevel } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuestionLevelController } from './question-level.controller';
import { QuestionLevelService } from './question-level.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([QuestionLevel]), AuthModule, UserModule],
    controllers: [QuestionLevelController, QuestionLevelsController],
    providers: [QuestionLevelService, { provide: QuestionLevelRepository, useFactory: (connection: Connection) => connection.getCustomRepository(QuestionLevelRepository), inject: [Connection] }],
    exports: [QuestionLevelService],
})
export class QuestionLevelModule {}
