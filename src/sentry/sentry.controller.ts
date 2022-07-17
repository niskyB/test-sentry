import { User } from './../core/models';
import { Controller, Get, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('sentry')
@ApiBearerAuth()
@Controller('sentry')
export class SentryController {
    @Get('/')
    async cGetSentry(@Res() res: Response) {
        const sentry = [] as User[];

        console.log(sentry[1].email);

        return res.send();
    }
}
