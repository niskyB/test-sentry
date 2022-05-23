import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user';

@Entity()
export class Sale {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'User' })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}
