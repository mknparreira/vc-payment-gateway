import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PaymentService } from 'src/services/payment.service';
import { Model } from 'mongoose';
import { mock, MockProxy } from 'jest-mock-extended';
import { PaymentInterface } from 'src/models/payment.model';
import { RefundInterface } from 'src/models/refund.model';
import {
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentModel: MockProxy<Model<PaymentInterface>>;
  let refundModel: MockProxy<Model<RefundInterface>>;

  beforeEach(async () => {
    paymentModel = mock<Model<PaymentInterface>>();
    refundModel = mock<Model<RefundInterface>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: getModelToken('Payment'), useValue: paymentModel },
        { provide: getModelToken('Refund'), useValue: refundModel },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should authorize payment with Provider A', async () => {
    const mockToken = 'mock-token';
    paymentModel.create.mockResolvedValue({
      authorizationToken: mockToken,
    } as any);

    jest.spyOn(service, 'selectProvider').mockReturnValue('ProviderA');

    const result = await service.authorizePayment(
      '4111111111111111',
      '08/25',
      123,
      100,
    );

    expect(result).toEqual({
      status: 'success',
      auth_token: expect.any(String),
    });

    expect(paymentModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        authorizationToken: expect.any(String),
        amount: 100,
        provider: 'ProviderA',
        status: 'authorized',
      }),
    );
  }, 20000);

  it('should fail authorization with Provider A for invalid card number', async () => {
    jest.spyOn(service, 'selectProvider').mockReturnValue('ProviderA');

    await expect(
      service.authorizePayment('5111111111111111', '08/25', 123, 100),
    ).rejects.toThrow(InternalServerErrorException);

    expect(paymentModel.create).not.toHaveBeenCalled();
  }, 20000);

  it('should always succeed authorization with Provider B', async () => {
    const mockToken = 'mock-token';
    paymentModel.create.mockResolvedValue({
      authorizationToken: mockToken,
    } as any);

    jest.spyOn(service, 'selectProvider').mockReturnValue('ProviderB');

    const result = await service.authorizePayment(
      '6111111111111111',
      '08/25',
      123,
      100,
    );

    expect(result).toEqual({
      status: 'success',
      auth_token: expect.any(String),
    });
    expect(paymentModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        authorizationToken: expect.any(String),
        amount: 100,
        provider: 'ProviderB',
        status: 'authorized',
      }),
    );
  }, 20000);

  it('should capture payment successfully', async () => {
    const payment = {
      status: 'authorized',
      amount: 100,
      save: jest.fn().mockResolvedValue(undefined),
    } as any;

    paymentModel.findOne.mockResolvedValue(payment);

    const result = await service.capturePayment('auth_token', 100);

    expect(result).toEqual({
      status: 'success',
      transaction_id: expect.any(String),
    });
    expect(payment.status).toBe('captured');
    expect(payment.save).toHaveBeenCalled();
  });

  it('should fail to capture payment with invalid auth token', async () => {
    paymentModel.findOne.mockResolvedValue(null);

    await expect(service.capturePayment('invalid_token', 100)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(paymentModel.findOne).toHaveBeenCalledWith({
      authorizationToken: 'invalid_token',
    });
  });

  it('should fail to capture payment with mismatched amount', async () => {
    const payment = {
      status: 'authorized',
      amount: 50,
    } as any;

    paymentModel.findOne.mockResolvedValue(payment);

    await expect(service.capturePayment('auth_token', 100)).rejects.toThrow(
      BadRequestException,
    );

    expect(paymentModel.findOne).toHaveBeenCalledWith({
      authorizationToken: 'auth_token',
    });
  });

  it('should refund payment successfully', async () => {
    const payment = {
      status: 'captured',
      transactionId: 'transaction_id',
      save: jest.fn().mockResolvedValue(undefined),
    } as any;

    refundModel.create.mockResolvedValue({
      refundId: 'refund_id',
      status: 'requested',
    } as any);

    refundModel.updateOne.mockResolvedValue({ nModified: 1 } as any);

    paymentModel.findOne.mockResolvedValue(payment);

    const result = await service.refundPayment('transaction_id', 100);

    expect(result).toEqual({
      status: 'success',
      refund_id: expect.any(String),
    });
    expect(payment.status).toBe('refunded');
    expect(payment.save).toHaveBeenCalled();
  });

  it('should fail to refund payment with invalid transaction id', async () => {
    paymentModel.findOne.mockResolvedValue(null);

    await expect(
      service.refundPayment('invalid_transaction_id', 100),
    ).rejects.toThrow(InternalServerErrorException);

    expect(paymentModel.findOne).toHaveBeenCalledWith({
      transactionId: 'invalid_transaction_id',
    });
  });

  it('should fail to refund payment if refund already processed', async () => {
    const payment = {
      status: 'refunded',
      transactionId: 'transaction_id',
    } as any;

    paymentModel.findOne.mockResolvedValue(payment);

    await expect(service.refundPayment('transaction_id', 100)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(paymentModel.findOne).toHaveBeenCalledWith({
      transactionId: 'transaction_id',
    });
  });
});
