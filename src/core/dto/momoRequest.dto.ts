import { ApiProperty } from '@nestjs/swagger';

export class MomoRequestDTO {
    @ApiProperty({ description: 'Partner Code', example: 'MOMO' })
    partnerCode: string;

    @ApiProperty({ description: 'Access Key', example: 'F8BBA842ECF85' })
    accessKey: string;

    @ApiProperty({ description: 'Request Id', example: 'asdfsdafasdf' })
    requestId: string;

    @ApiProperty({ description: 'Order Id', example: 'asdfsdafasdf' })
    orderId: string;

    @ApiProperty({ description: 'Order Info', example: 'pay with MoMo' })
    orderInfo: string;

    @ApiProperty({ description: 'Redirect Url', example: 'https://momo.vn/return' })
    redirectUrl: string;

    @ApiProperty({ description: 'Ipn Url', example: 'https://callback.url/notify' })
    ipnUrl: string;

    @ApiProperty({ description: 'Amount', example: '50000' })
    amount: number;

    @ApiProperty({ description: 'Request Type', example: 'captureWallet' })
    requestType: string;

    @ApiProperty({ description: 'ExtraData', example: '' })
    extraData: string;

    @ApiProperty({ description: 'Signature', example: '' })
    signature: string;

    @ApiProperty({ description: 'Lang', example: 'en' })
    lang: string;
}
