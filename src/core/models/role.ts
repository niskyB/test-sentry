import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SystemType } from '../interface';

export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    MARKETING = 'marketing',
    SALE = 'sale',
    EXPERT = 'expert',
}

@Entity()
export class Role {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Type' })
    @Column({ default: SystemType.USER_ROLE })
    type: string;

    @ApiProperty({ description: 'Value' })
    @Column()
    @Generated('uuid')
    value: string;

    @ApiProperty({ description: 'Order' })
    @Column({ default: null, unique: true })
    order: string;

    @ApiProperty({ description: 'Description' })
    @Column({ default: null })
    description: string;

    @ApiProperty({ description: 'Is Active' })
    @Column({ default: true })
    isActive: boolean;
}
