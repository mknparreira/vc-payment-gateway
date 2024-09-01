import { Controller, Post, Body } from '@nestjs/common';
import { AuthorizePaymentRequest } from 'src/dto/request/authorize-payment-request.dto';
import { CapturePaymentRequest } from 'src/dto/request/capture-payment-request.dto';
import { RefundPaymentRequest } from 'src/dto/request/refund-payment-request.dto';
import { AuthorizePaymentResponse } from 'src/dto/response/authorize-payment-response.dto';
import { CapturePaymentResponse } from 'src/dto/response/capture-payment-response.dto';
import { RefundPaymentResponse } from 'src/dto/response/refund-payment-response.dto';
import { PaymentService } from 'src/services/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('authorize')
  async authorize(
    @Body() body: AuthorizePaymentRequest,
  ): Promise<AuthorizePaymentResponse> {
    const response = await this.paymentService.authorizePayment(
      body.card_number,
      body.expiry_date,
      body.amount,
    );
    return response;
  }

  @Post('capture')
  async capture(
    @Body() body: CapturePaymentRequest,
  ): Promise<CapturePaymentResponse> {
    const response = await this.paymentService.capturePayment(
      body.token,
      body.amount,
    );
    return response;
  }

  @Post('refund')
  async refund(
    @Body() body: RefundPaymentRequest,
  ): Promise<RefundPaymentResponse> {
    const response = await this.paymentService.refundPayment(
      body.transaction_id,
    );
    return response;
  }
}
