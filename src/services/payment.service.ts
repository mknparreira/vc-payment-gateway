import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { PaymentInterface } from 'src/models/payment.model';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PaymentModel')
    private readonly paymentModel: Model<PaymentInterface>,
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
    amount: number,
  ): Promise<{ status: string; auth_token?: string; message?: string }> {
    const provider = this.selectProvider();
    let success = false;

    if (provider === 'ProviderA') {
      success = cardNumber.startsWith('4');
    } else {
      success = true; // Provider B always succeeds
    }

    if (!success) {
      return { status: 'error', message: 'Invalid card details' };
    }

    const token = randomUUID();
    await this.paymentModel.create({
      authorizationToken: token,
      amount,
      provider,
      status: 'authorized',
    });

    return { status: 'success', auth_token: token };
  }

  async capturePayment(
    auth_token: string,
    amount: number,
  ): Promise<{ status: string; transaction_id?: string; message?: string }> {
    const payment = await this.paymentModel.findOne({
      authorizationToken: auth_token,
    });

    if (!payment || payment.status !== 'authorized') {
      return {
        status: 'error',
        message: 'Authorization token invalid, expired, or already captured',
      };
    }

    if (payment.amount !== amount) {
      return {
        status: 'error',
        message: 'Capture amount does not match authorized amount',
      };
    }

    payment.status = 'captured';
    const transactionId = randomUUID();
    await payment.save();

    return { status: 'success', transaction_id: transactionId };
  }

  async refundPayment(
    transaction_id: string,
  ): Promise<{ status: string; message?: string }> {
    const payment = await this.paymentModel.findOne({
      authorizationToken: transaction_id,
    });

    if (!payment || payment.status !== 'captured') {
      return {
        status: 'error',
        message: 'Invalid transaction ID or refund already processed',
      };
    }

    payment.status = 'refunded';
    await payment.save();

    return { status: 'success' };
  }
}
