import { Expert } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { ExpertRepository } from '../core/repositories';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Expert])],
    controllers: [ExpertController],
    providers: [ExpertService, { provide: ExpertRepository, useFactory: (connection: Connection) => connection.getCustomRepository(ExpertRepository), inject: [Connection] }],
    exports: [ExpertService],
})
export class ExpertModule {}
