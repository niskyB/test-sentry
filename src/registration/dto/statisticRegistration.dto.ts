import { RegistrationStatus, registrationValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class StatisticRegistrationsDTO {
    @ApiProperty({ description: 'status', example: RegistrationStatus.SUBMITTED, nullable: true })
    status: RegistrationStatus;
}

export const vStatisticRegistrationsDTO = joi.object<StatisticRegistrationsDTO>({
    status: registrationValidateSchema.status.failover(''),
});
