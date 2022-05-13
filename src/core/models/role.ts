import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
}

@Entity()
export class Role {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Name' })
    @Column({ default: null })
    name: string;
}
