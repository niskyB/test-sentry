import { JoiMessage } from 'joi-message';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export enum UserStatisticOption {
    NEWLY_REGISTER = 'Newly Register',
    NEWLY_BOUGHT = 'Newly Bought',
}

export class StatisticUserDTO {
    @ApiProperty({ description: 'Option', example: 'asdf-asdf-asdf', nullable: true })
    option: UserStatisticOption;
}

export const vStatisticUserDTO = joi.object<StatisticUserDTO>({
    option: joi
        .string()
        .valid(UserStatisticOption.NEWLY_BOUGHT, UserStatisticOption.NEWLY_REGISTER)
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Option' })),
});
