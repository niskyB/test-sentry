import { FilterService } from './../core/providers/filter/filter.service';
import { SortOrder } from './../core/interface';
import { Subject } from './../core/models';
import { SubjectRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class SubjectService {
    constructor(private readonly subjectRepository: SubjectRepository, private readonly filterService: FilterService) {}

    async getSubjectByField(field: keyof Subject, value: any): Promise<Subject> {
        return await this.subjectRepository
            .createQueryBuilder('subject')
            .where(`subject.${field.toString()} = :value`, { value })
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .leftJoinAndSelect('subject.category', 'category')
            .leftJoinAndSelect('subject.lessons', 'lessons')
            .leftJoinAndSelect('subject.pricePackages', 'pricePackages')
            .getOne();
    }

    async saveSubject(subject: Subject): Promise<Subject> {
        return await this.subjectRepository.save(subject);
    }

    async getAllSubjects(): Promise<Subject[]> {
        const subjects = await this.subjectRepository
            .createQueryBuilder('subject')
            .leftJoinAndSelect('subject.lessons', 'lessons')
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .leftJoinAndSelect(`subject.category`, 'category')
            .getMany();

        return subjects;
    }

    async getSubjectByUserId(id: string): Promise<Subject[]> {
        const subjects = await this.subjectRepository
            .createQueryBuilder('subject')
            .leftJoinAndSelect('subject.lessons', 'lessons')
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .where('user.id = (:id)', { id })
            .leftJoinAndSelect(`subject.category`, 'category')
            .getMany();

        return subjects;
    }

    async getCountByDay(day: string): Promise<{ value: number; date: string }> {
        let value;
        try {
            value = await this.subjectRepository
                .createQueryBuilder('subject')
                .where('subject.createdAt LIKE (:day)', { day: `%${day}%` })
                .getCount();
        } catch (err) {
            console.log(err);
            return { value: 0, date: day };
        }
        return { value, date: day };
    }

    async filterSubjects(
        name: string,
        createdAt: string,
        currentPage: number,
        pageSize: number,
        isActive: boolean,
        isFeature: boolean,
        category: string,
        assignTo: string,
        order: SortOrder,
    ): Promise<{ data: Subject[]; count: number }> {
        try {
            const date = new Date(createdAt);
            const activeValue = this.filterService.getMinMaxValue(isActive);
            const featureValue = this.filterService.getMinMaxValue(isFeature);
            const subjects = await this.subjectRepository
                .createQueryBuilder('subject')
                .where(`subject.name LIKE (:name)`, {
                    name: `%${name}%`,
                })
                .andWhere(`subject.createdAt >= (:createdAt)`, { createdAt: date })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('subject.isActive = :activeMinValue', {
                            activeMinValue: activeValue.minValue,
                        }).orWhere('subject.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                    }),
                )
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('subject.isFeature = :featureMinValue', {
                            featureMinValue: featureValue.minValue,
                        }).orWhere('subject.isFeature = :featureMaxValue', { featureMaxValue: featureValue.maxValue });
                    }),
                )
                .leftJoinAndSelect('subject.lessons', 'lessons')
                .leftJoinAndSelect('subject.assignTo', 'assignTo')
                .leftJoinAndSelect('assignTo.user', 'user')
                .leftJoinAndSelect('subject.pricePackages', 'pricePackages')
                .andWhere(`user.id LIKE (:id)`, { id: `%${assignTo}%` })
                .leftJoinAndSelect(`subject.category`, 'category')
                .andWhere(`category.id LIKE (:categoryId)`, { categoryId: `%${category}%` })
                .orderBy(`subject.createdAt`, 'DESC')
                .skip(currentPage * pageSize)
                .take(pageSize)
                .orderBy('subject.updatedAt', order)
                .getMany();

            const count = await this.subjectRepository
                .createQueryBuilder('subject')
                .where(`subject.name LIKE (:name)`, {
                    name: `%${name}%`,
                })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('subject.isActive = :activeMinValue', {
                            activeMinValue: activeValue.minValue,
                        }).orWhere('subject.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                    }),
                )
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('subject.isFeature = :featureMinValue', {
                            featureMinValue: featureValue.minValue,
                        }).orWhere('subject.isFeature = :featureMaxValue', { featureMaxValue: featureValue.maxValue });
                    }),
                )
                .andWhere(`subject.createdAt >= (:createdAt)`, { createdAt: date })
                .leftJoinAndSelect('subject.assignTo', 'assignTo')
                .leftJoinAndSelect('assignTo.user', 'user')
                .andWhere(`user.id LIKE (:id)`, { id: `%${assignTo}%` })
                .leftJoinAndSelect(`subject.category`, 'category')
                .andWhere(`category.id LIKE (:categoryId)`, { categoryId: `%${category}%` })
                .getCount();

            return { data: subjects, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }

    async filterSubjectsForAdmin(
        name: string,
        createdAt: string,
        currentPage: number,
        pageSize: number,
        isActive: boolean,
        isFeature: boolean,
        category: string,
    ): Promise<{ data: Subject[]; count: number }> {
        try {
            const date = new Date(createdAt);
            const activeValue = this.filterService.getMinMaxValue(isActive);
            const featureValue = this.filterService.getMinMaxValue(isFeature);
            const subjects = await this.subjectRepository
                .createQueryBuilder('subject')
                .where(`subject.name LIKE (:name)`, {
                    name: `%${name}%`,
                })
                .andWhere(`subject.createdAt >= (:createdAt)`, { createdAt: date })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('subject.isActive = :activeMinValue', {
                            activeMinValue: activeValue.minValue,
                        }).orWhere('subject.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                    }),
                )
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('subject.isFeature = :featureMinValue', {
                            featureMinValue: featureValue.minValue,
                        }).orWhere('subject.isFeature = :featureMaxValue', { featureMaxValue: featureValue.maxValue });
                    }),
                )
                .leftJoinAndSelect('subject.lessons', 'lessons')
                .leftJoinAndSelect('subject.assignTo', 'assignTo')
                .leftJoinAndSelect('assignTo.user', 'user')
                .leftJoinAndSelect('subject.pricePackages', 'pricePackages')
                .leftJoinAndSelect(`subject.category`, 'category')
                .andWhere(`category.id LIKE (:categoryId)`, { categoryId: `%${category}%` })
                .orderBy(`subject.createdAt`, 'DESC')
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            const count = await this.subjectRepository
                .createQueryBuilder('subject')
                .where(`subject.name LIKE (:name)`, {
                    name: `%${name}%`,
                })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('subject.isActive = :activeMinValue', {
                            activeMinValue: activeValue.minValue,
                        }).orWhere('subject.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                    }),
                )
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('subject.isFeature = :featureMinValue', {
                            featureMinValue: featureValue.minValue,
                        }).orWhere('subject.isFeature = :featureMaxValue', { featureMaxValue: featureValue.maxValue });
                    }),
                )
                .andWhere(`subject.createdAt >= (:createdAt)`, { createdAt: date })
                .leftJoinAndSelect('subject.assignTo', 'assignTo')
                .leftJoinAndSelect('assignTo.user', 'user')
                .leftJoinAndSelect(`subject.category`, 'category')
                .andWhere(`category.id LIKE (:categoryId)`, { categoryId: `%${category}%` })
                .getCount();

            return { data: subjects, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }
}
