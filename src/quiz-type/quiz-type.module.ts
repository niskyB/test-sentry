import { FilterModule } from '../core/providers/filter/filter.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { QuizTypeRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizTypeController } from './quiz-type.controller';
import { QuizTypeService } from './quiz-type.service';
import { QuizType } from '../core/models';
import { Connection } from 'typeorm';
import { QuizTypesController } from './quiz.types.controller';

@Module({
    imports: [TypeOrmModule.forFeature([QuizType]), AuthModule, UserModule, FilterModule],
    controllers: [QuizTypeController, QuizTypesController],
    providers: [QuizTypeService, { provide: QuizTypeRepository, useFactory: (connection: Connection) => connection.getCustomRepository(QuizTypeRepository), inject: [Connection] }],
    exports: [QuizTypeService],
})
export class QuizTypeModule {}
