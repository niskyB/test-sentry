import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Lesson } from './lesson';

@Entity()
export class QuestionInQuiz {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Html Content' })
    @Column('longtext', { default: null })
    htmlContent: string;

    @ApiProperty({ description: 'Video link' })
    @Column('longtext', { default: null })
    videoLink: string;

    @ApiProperty({ description: 'Lesson' })
    @OneToOne(() => Lesson)
    lesson: Lesson;
}
