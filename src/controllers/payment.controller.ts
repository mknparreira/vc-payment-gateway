import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizePaymentRequest } from 'src/dto/request/authorize-payment-request.dto';
import { CapturePaymentRequest } from 'src/dto/request/capture-payment-request.dto';
import { RefundPaymentRequest } from 'src/dto/request/refund-payment-request.dto';
import { AuthorizePaymentResponse } from 'src/dto/response/authorize-payment-response.dto';
import { CapturePaymentResponse } from 'src/dto/response/capture-payment-response.dto';
import { RefundPaymentResponse } from 'src/dto/response/refund-payment-response.dto';
import { PaymentService } from 'src/services/payment.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('authorize')
  @ApiOperation({ summary: 'Authorize a payment' })
  @ApiResponse({ status: 201, description: 'Payment authorized successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters.' })
  async authorize(
    @Body() body: AuthorizePaymentRequest,
  ): Promise<AuthorizePaymentResponse> {
    const response = await this.paymentService.authorizePayment(
      body.card_number,
      body.expiry_date,
      body.cvv,
      body.amount,
    );
    return response;
  }

  @Post('capture')
  @ApiOperation({ summary: 'Capture a payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment captured successfully.',
    type: CapturePaymentResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters.' })
  @ApiResponse({ status: 401, description: 'Unauthorized or invalid token.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
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
  @ApiOperation({ summary: 'Refund a payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment refunded successfully.',
    type: RefundPaymentResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async refund(
    @Body() body: RefundPaymentRequest,
  ): Promise<RefundPaymentResponse> {
    const response = await this.paymentService.refundPayment(
      body.transaction_id,
      body.amount,
    );
    return response;
  }
}
