import { ApiProperty } from '@nestjs/swagger';

export class MomoCallbackDTO {
    @ApiProperty({ description: 'Partner Code', example: 'MOMOD2asdasd' })
    partnerCode: string;

    @ApiProperty({ description: 'Order Id', example: '123456' })
    orderId: string;

    @ApiProperty({ description: 'Request Id', example: '123456' })
    requestId: string;

    @ApiProperty({ description: 'Amount', example: '50000' })
    amount: number;

    @ApiProperty({ description: 'Order Info', example: 'Test Thue 1234556' })
    orderInfo: string;

    @ApiProperty({ description: 'Order Type', example: 'momo_wallet' })
    orderType: string;

    @ApiProperty({ description: 'Trans Id', example: 2588659987 })
    transId: number;

    @ApiProperty({ description: 'Result Code', example: 0 })
    resultCode: number;

    @ApiProperty({ description: 'Message', example: 'Giao dịch thành công.' })
    message: string;

    @ApiProperty({ description: 'payType', example: 'qr' })
    payType: string;

    @ApiProperty({ description: 'Response Time', example: 1633504902954 })
    responseTime: number;

    @ApiProperty({ description: 'payType', example: 'qr' })
    extraData: string;

    @ApiProperty({ description: 'signature', example: 'qr' })
    signature: string;
}
