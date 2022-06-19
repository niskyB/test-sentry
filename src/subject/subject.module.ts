import { FilterModule } from './../core/providers/filter/filter.module';
import { Subject } from './../core/models';
import { SubjectCategoryModule } from './../subject-category/subject-category.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { S3Module } from './../core/providers/s3/s3.module';
import { SubjectRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertModule } from './../expert/expert.module';
import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { SubjectsController } from './subjects.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [ExpertModule, TypeOrmModule.forFeature([Subject]), S3Module, AuthModule, UserModule, SubjectCategoryModule, FilterModule],
    controllers: [SubjectController, SubjectsController],
    providers: [SubjectService, { provide: SubjectRepository, useFactory: (connection: Connection) => connection.getCustomRepository(SubjectRepository), inject: [Connection] }],
    exports: [SubjectService],
})
export class SubjectModule {}
