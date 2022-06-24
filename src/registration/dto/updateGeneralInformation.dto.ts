import { RegistrationStatus, registrationValidateSchema } from '../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class UpdateGeneralInformationDTO {
    @ApiProperty({ description: 'status', example: RegistrationStatus.SUBMITTED })
    status: RegistrationStatus;

    @ApiProperty({ description: 'Valid from', example: 'cc' })
    validFrom: string;

    @ApiProperty({ description: 'Valid to', example: 'cc' })
    validTo: string;

    @ApiProperty({ description: 'Note', example: 'cc' })
    notes: string;
}

export const vUpdateGeneralInformationDTO = joi.object<UpdateGeneralInformationDTO>({
    status: registrationValidateSchema.status.failover(''),
    validFrom: registrationValidateSchema.validFrom,
    validTo: registrationValidateSchema.validTo,
    notes: joi.string().required().failover(''),
});
