import { SubjectCategoryService } from './../subject-category/subject-category.service';
import { S3Service } from './../core/providers/s3/s3.service';
import { Subject } from './../core/models';
import { ExpertService } from './../expert/expert.service';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface';
import { JoiValidatorPipe } from './../core/pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, UseInterceptors, Req, Res, Body, UploadedFile, HttpException, UsePipes } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDTO, vCreateSubjectDTO } from './dto';
import { Request, Response } from 'express';

@Controller('subject')
export class SubjectController {
    constructor(
        private readonly subjectService: SubjectService,
        private readonly expertService: ExpertService,
        private readonly s3Service: S3Service,
        private readonly subjectCategoryService: SubjectCategoryService,
    ) {}

    @Post('')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vCreateSubjectDTO))
    async cCreateSlider(@Req() req: Request, @Res() res: Response, @Body() body: CreateSubjectDTO, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new HttpException({ errorMessage: ResponseMessage.INVALID_IMAGE }, StatusCodes.BAD_REQUEST);

        const subjectCategory = await this.subjectCategoryService.getSubjectCategoryByField('name', body.category);
        if (!subjectCategory) throw new HttpException({ category: ResponseMessage.INVALID_CATEGORY }, StatusCodes.BAD_REQUEST);

        const expert = await this.expertService.getExpertByUserId(body.assignTo);

        const newSubject = new Subject();
        newSubject.title = body.title;
        newSubject.tagLine = body.tagLine;
        newSubject.description = body.description;
        newSubject.category = subjectCategory;
        newSubject.assignTo = expert;

        const result = await this.s3Service.uploadFile(file);
        if (result) newSubject.thumbnailUrl = result.Location;
        else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);

        await this.subjectService.saveSubject(newSubject);

        return res.send(newSubject);
    }
}
