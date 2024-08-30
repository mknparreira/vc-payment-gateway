import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from 'src/services/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('authorize')
  async authorize(@Body() body: { card_number: string; amount: number }) {
    const response = await this.paymentService.authorizePayment(
      body.card_number,
      body.amount,
    );
    return response;
  }

  @Post('capture/:token')
  async capture(
    @Param('token') token: string,
    @Body() body: { amount: number },
  ) {
    const response = await this.paymentService.capturePayment(
      token,
      body.amount,
    );
    return response;
  }

  @Post('refund/:transaction_id')
  async refund(@Param('transaction_id') transaction_id: string) {
    const response = await this.paymentService.refundPayment(transaction_id);
    return response;
  }
}
