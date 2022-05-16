import * as multer from 'multer';
import * as path from 'path';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: any) {
        cb(null, path.resolve('uploads'));
    },
    filename: function (req: Request, file: Express.Multer.File, cb: any) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + file.originalname + file.mimetype.replace('/', '.'));
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
        cb(null, true);
    } else {
        cb(new BadRequestException());
    }
};

export const multerOptions = {
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
};
