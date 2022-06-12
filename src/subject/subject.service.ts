import { Subject } from './../core/models';
import { SubjectRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class SubjectService {
    constructor(private readonly subjectRepository: SubjectRepository) {}

    async getSubjectByField(field: keyof Subject, value: any): Promise<Subject> {
        return await this.subjectRepository
            .createQueryBuilder('subject')
            .where(`subject.${field.toString()} = :value`, { value })
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .leftJoinAndSelect('subject.category', 'category')
            .getOne();
    }

    async saveSubject(subject: Subject): Promise<Subject> {
        return await this.subjectRepository.save(subject);
    }

    getMinMaxValue(value: boolean) {
        if (value === false)
            return {
                minValue: 0,
                maxValue: 0,
            };
        if (value === true)
            return {
                minValue: 1,
                maxValue: 1,
            };
        if (value === null)
            return {
                minValue: 0,
                maxValue: 1,
            };
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
    ): Promise<{ data: Subject[]; count: number }> {
        try {
            const date = new Date(createdAt);
            const activeValue = this.getMinMaxValue(isActive);
            const featureValue = this.getMinMaxValue(isFeature);
            const sliders = await this.subjectRepository
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
                .leftJoinAndSelect('subject.assignTo', 'assignTo')
                .leftJoinAndSelect('assignTo.user', 'user')
                .andWhere(`user.id LIKE (:id)`, { id: `%${assignTo}%` })
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
                .andWhere(`user.id LIKE (:id)`, { id: `%${assignTo}%` })
                .leftJoinAndSelect(`subject.category`, 'category')
                .andWhere(`category.id LIKE (:categoryId)`, { categoryId: `%${category}%` })
                .getCount();

            return { data: sliders, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }
}
