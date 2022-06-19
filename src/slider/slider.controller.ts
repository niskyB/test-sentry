import { S3Service } from '../core/providers/s3/s3.service';
import { ResponseMessage } from './../core/interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Slider, UserRole } from './../core/models';
import { UserService } from '../user/user.service';
import { CreateSliderDTO, vCreateSliderDTO, vUpdateSliderDTO, UpdateSliderDTO } from './dto';
import { JoiValidatorPipe } from './../core/pipe';
import { MarketingGuard } from './../auth/guard';
import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, UseInterceptors, UploadedFile, HttpException, Get, Param, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SliderService } from './slider.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MarketingService } from '../marketing/marketing.service';

@ApiTags('slider')
@ApiBearerAuth()
@UseGuards(MarketingGuard)
@Controller('slider')
export class SliderController {
    constructor(private readonly sliderService: SliderService, private readonly userService: UserService, private readonly s3Service: S3Service, private readonly marketingService: MarketingService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetSlider(@Param('id') id: string, @Res() res: Response) {
        const slider = await this.sliderService.getSliderByField('id', id);
        if (!slider) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (slider.marketing) {
            slider.marketing.user.password = '';
            slider.marketing.user.token = '';
        }
        return res.send(slider);
    }

    @Post('')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vCreateSliderDTO))
    async cCreateSlider(@Req() req: Request, @Res() res: Response, @Body() body: CreateSliderDTO, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new HttpException({ errorMessage: ResponseMessage.INVALID_IMAGE }, StatusCodes.BAD_REQUEST);

        const marketing = await this.marketingService.getMarketingByUserId(req.user.id);

        const newSlider = new Slider();
        newSlider.title = body.title;
        newSlider.backLink = body.backLink;
        newSlider.notes = body.notes;
        newSlider.isShow = body.isShow;
        newSlider.marketing = marketing;

        const result = await this.s3Service.uploadFile(file);
        if (result) newSlider.imageUrl = result.Location;
        else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);

        newSlider.createdAt = new Date().toISOString();
        await this.sliderService.saveSlider(newSlider);

        if (newSlider.marketing) {
            newSlider.marketing.user.password = '';
            newSlider.marketing.user.token = '';
        }

        return res.send(newSlider);
    }

    @Put('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vUpdateSliderDTO))
    async cUpdateSlider(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Body() body: UpdateSliderDTO, @UploadedFile() file: Express.Multer.File) {
        const user = await this.userService.findUser('id', req.user.id);
        const slider = await this.sliderService.getSliderByField('id', id);

        if (!slider) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (user.role.description !== UserRole.ADMIN && slider.marketing.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        slider.title = body.title || slider.title;
        slider.backLink = body.backLink || slider.backLink;
        slider.notes = body.notes || slider.notes;
        slider.isShow = body.isShow === null || body.isShow === undefined ? slider.isShow : body.isShow;

        if (file) {
            const result = await this.s3Service.uploadFile(file);
            if (result) slider.imageUrl = result.Location;
            else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        await this.sliderService.saveSlider(slider);

        if (slider.marketing) {
            slider.marketing.user.password = '';
            slider.marketing.user.token = '';
        }

        return res.send(slider);
    }
}
