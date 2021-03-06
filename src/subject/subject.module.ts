import { DateModule, FilterModule, S3Module } from './../core/providers';
import { Subject } from './../core/models';
import { SubjectCategoryModule } from './../subject-category/subject-category.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { SubjectRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertModule } from './../expert/expert.module';
import { Module, forwardRef } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { SubjectsController } from './subjects.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [ExpertModule, TypeOrmModule.forFeature([Subject]), S3Module, AuthModule, forwardRef(() => UserModule), SubjectCategoryModule, FilterModule, DateModule],
    controllers: [SubjectController, SubjectsController],
    providers: [SubjectService, { provide: SubjectRepository, useFactory: (connection: Connection) => connection.getCustomRepository(SubjectRepository), inject: [Connection] }],
    exports: [SubjectService],
})
export class SubjectModule {}
