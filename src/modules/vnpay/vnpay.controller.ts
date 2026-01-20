import { Controller, Post, Get, Body, Req, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VnpayService } from './vnpay.service';
import { CreateVnpayPaymentDto } from './dto/create-vnpay-payment.dto';
import type { Request, Response } from 'express';
import { InvoicesService } from '../invoices/invoices.service';

@ApiTags('vnpay')
@Controller('vnpay')
export class VnpayController {
  constructor(
    private readonly vnpayService: VnpayService,
    private readonly invoicesService: InvoicesService,
  ) { }

  @Post('create-payment')
  @ApiOperation({ summary: 'Create VNPay payment URL' })
  createPayment(@Body() dto: CreateVnpayPaymentDto, @Req() req: Request) {
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const paymentUrl = this.vnpayService.createPaymentUrl(dto, ipAddr as string);
    return { paymentUrl };
  }

  @Get('vnp_return')
  @ApiOperation({ summary: 'VNPay return URL handler' })
  vnpayReturn(@Query() query: any, @Res() res: Response) {
    const isValid = this.vnpayService.verifyCallback(query);
    if (isValid) {
      const orderId = query['vnp_TxnRef'];
      const rspCode = query['vnp_ResponseCode'];
      return res.redirect(`${process.env.FRONTEND_URL}/payment-result?orderId=${orderId}&vnp_ResponseCode=${rspCode}`);
    } else {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-result?error=invalid_signature`);
    }
  }

  @Get('vnp_ipn')
  @ApiOperation({ summary: 'VNPay IPN handler' })
  async vnpayIpn(@Query() query: any) {
    const isValid = this.vnpayService.verifyCallback(query);
    if (isValid) {
      const orderId = query['vnp_TxnRef'];
      const rspCode = query['vnp_ResponseCode'];

      if (rspCode === '00') {
        try {
          await this.invoicesService.update(orderId, { status: 'completed' });
          return { RspCode: '00', Message: 'Success' };
        } catch (error) {
          return { RspCode: '01', Message: 'Order not found' };
        }
      } else {
        return { RspCode: '00', Message: 'Payment failed' };
      }
    } else {
      return { RspCode: '97', Message: 'Invalid Checksum' };
    }
  }
}
