import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface';
import { SubjectService } from './../subject/subject.service';
import { PricePackage } from './../core/models';
import { AdminGuard, ExpertGuard } from './../auth/guard';
import { Body, Controller, Post, Res, UseGuards, UsePipes, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PricePackageService } from './price-package.service';
import { JoiValidatorPipe } from '../core/pipe';
import { CreatePricePackageDTO, vCreatePricePackageDTO } from './dto';
import { Response } from 'express';

@ApiTags('price package')
@ApiBearerAuth()
@UseGuards(ExpertGuard)
@Controller('price-package')
export class PricePackageController {
    constructor(private readonly pricePackageService: PricePackageService, private readonly subjectService: SubjectService) {}

    @Post('')
    @UseGuards(AdminGuard)
    @UsePipes(new JoiValidatorPipe(vCreatePricePackageDTO))
    async cCreateSlider(@Res() res: Response, @Body() body: CreatePricePackageDTO) {
        const subject = await this.subjectService.getSubjectByField('id', body.subjectId);

        if (!subject) throw new HttpException({ errorMessage: ResponseMessage.INVALID_SUBJECT }, StatusCodes.BAD_REQUEST);

        const newPricePackage = new PricePackage();
        newPricePackage.name = body.name;
        newPricePackage.originalPrice = body.originalPrice;
        newPricePackage.salePrice = body.salePrice;
        newPricePackage.duration = body.duration;
        newPricePackage.subject = subject;

        await this.pricePackageService.savePricePackage(newPricePackage);

        return res.send(newPricePackage);
    }
}
