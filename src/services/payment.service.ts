import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { AuthorizePaymentResponse } from 'src/dto/response/authorize-payment-response.dto';
import { CapturePaymentResponse } from 'src/dto/response/capture-payment-response.dto';
import { RefundPaymentResponse } from 'src/dto/response/refund-payment-response.dto';
import { PaymentInterface } from 'src/models/payment.model';
import { RefundInterface } from 'src/models/refund.model';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PaymentModel')
    private readonly paymentModel: Model<PaymentInterface>,
    @Inject('RefundModel')
    private readonly refundModel: Model<RefundInterface>,
  ) {}

  private readonly providerWeights = {
    ProviderA: 60,
    ProviderB: 40,
  };

  public selectProvider(): string {
    const rand = Math.random() * 100;
    return rand <= this.providerWeights.ProviderA ? 'ProviderA' : 'ProviderB';
  }

  async authorizePayment(
    cardNumber: string,
    expiryDate: string,
    cvv: number,
    amount: number,
  ): Promise<AuthorizePaymentResponse> {
    try {
      const provider = this.selectProvider();
      let success = false;

      if (provider === 'ProviderA') {
        success = cardNumber.startsWith('4');
      } else {
        success = true; // Provider B always succeeds
      }

      if (!success)
        throw new InternalServerErrorException('Invalid card details');

      const token = randomUUID();
      await this.paymentModel.create({
        authorizationToken: token,
        amount,
        expiryDate,
        cvv,
        provider,
        status: 'authorized',
      });

      return { status: 'success', auth_token: token };
    } catch (error) {
      throw error;
    }
  }

  async capturePayment(
    auth_token: string,
    amount: number,
  ): Promise<CapturePaymentResponse> {
    try {
      const payment = await this.paymentModel.findOne({
        authorizationToken: auth_token,
      });

      if (!payment || payment.status !== 'authorized') {
        throw new UnauthorizedException(
          'Authorization token invalid, expired, or already captured',
        );
      }

      if (payment.amount !== amount) {
        throw new BadRequestException(
          'Capture amount does not match authorized amount',
        );
      }

      const transactionId = randomUUID();
      payment.status = 'captured';
      payment.transactionId = transactionId;
      await payment.save();

      return { status: 'success', transaction_id: transactionId };
    } catch (error) {
      throw error;
    }
  }

  async refundPayment(
    transaction_id: string,
    amount: number,
  ): Promise<RefundPaymentResponse> {
    try {
      const payment = await this.paymentModel.findOne({
        transactionId: transaction_id,
      });

      if (!payment || payment.status !== 'captured') {
        throw new InternalServerErrorException(
          'Invalid transaction ID or refund already processed',
        );
      }

      const refundId = randomUUID();
      const refund = await this.refundModel.create({
        transactionId: transaction_id,
        amount,
        refundId,
        status: 'requested',
      });

      const updateRefund = await this.refundModel.updateOne(
        { refundId },
        { status: 'completed' },
      );

      if (!updateRefund)
        throw new InternalServerErrorException(
          'Occurred an error to complete refund',
        );

      payment.status = 'refunded';
      await payment.save();

      return { status: 'success', refund_id: refund.refundId };
    } catch (error) {
      throw error;
    }
  }
}
