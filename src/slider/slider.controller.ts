import { multerOptions } from './../core/multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Slider } from './../core/models';
import { UserService } from '../user/user.service';
import { CreateSliderDTO, vCreateSliderDTO } from './dto';
import { JoiValidatorPipe } from './../core/pipe/validator.pipe';
import { MarketingGuard } from './../auth/guard';
import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SliderService } from './slider.service';
import { Request, Response } from 'express';

@ApiTags('slider')
@ApiBearerAuth()
@UseGuards(MarketingGuard)
@Controller('slider')
export class SliderController {
    constructor(private readonly sliderService: SliderService, private readonly userService: UserService) {}

    @Post('')
    @UseInterceptors(FileInterceptor('image', multerOptions))
    @UsePipes(new JoiValidatorPipe(vCreateSliderDTO))
    async cCreateSlider(@Req() req: Request, @Res() res: Response, @Body() body: CreateSliderDTO, @UploadedFile() file: Express.Multer.File) {
        const user = await this.userService.findUser('id', req.user.id);

        const newSlider = new Slider();
        newSlider.title = body.title;
        newSlider.backLink = body.backLink;
        newSlider.user = user;
        newSlider.imageUrl = file.filename;
        await this.sliderService.saveSlider(newSlider);

        return res.send(newSlider);
    }
}
