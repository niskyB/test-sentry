import { AttendedQuestion } from './attended-question';
import { Answer } from './answer';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserAnswer {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Answer' })
    @ManyToOne(() => Answer, { nullable: false })
    answer: Answer;

    @ApiProperty({ description: 'Attended Question' })
    @ManyToOne(() => AttendedQuestion, { nullable: false, cascade: true })
    attendedQuestion: AttendedQuestion;
}
