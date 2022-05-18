import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { config } from 'src/core/config';

@Injectable()
export class S3Service {
    private s3 = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    });

    async uploadFile(file) {
        const { originalname } = file;

        const res = await this.s3_upload(file.buffer, config.AWS_BUCKET, originalname, file.mimetype);
        return res;
    }

    async s3_upload(file, bucket, name, mimetype) {
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: 'public-read',
            ContentType: mimetype,
            ContentDisposition: 'inline',
            CreateBucketConfiguration: {
                LocationConstraint: 'ap-south-1',
            },
        };

        try {
            const s3Response = await this.s3.upload(params).promise();
            console.log(s3Response);
            return s3Response;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}
