import { FilterModule } from './../core/providers/filter/filter.module';
import { SubjectCategory } from './../core/models';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { SubjectCategoryService } from './subject-category.service';
import { SubjectCategoryController } from './subject-category.controller';
import { SubjectCategoryRepository } from './../core/repositories/subjectCategory.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubjectCategoriesController } from './subject-categories.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SubjectCategory]), AuthModule, UserModule, FilterModule],
    controllers: [SubjectCategoryController, SubjectCategoriesController],
    providers: [
        SubjectCategoryService,
        { provide: SubjectCategoryRepository, useFactory: (connection: Connection) => connection.getCustomRepository(SubjectCategoryRepository), inject: [Connection] },
    ],
    exports: [SubjectCategoryService],
})
export class SubjectCategoryModule {}
