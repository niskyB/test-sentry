import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Question } from './question';
import { Quiz } from './quiz';

@Entity()
export class QuizDetail {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Question' })
    @ManyToOne(() => Question, { nullable: false })
    question: Question;

    @ApiProperty({ description: 'Quiz' })
    @ManyToOne(() => Quiz, { nullable: false })
    quiz: Quiz;
}
