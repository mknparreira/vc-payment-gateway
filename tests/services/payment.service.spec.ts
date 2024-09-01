import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PaymentService } from 'src/services/payment.service';
import { Model } from 'mongoose';
import { mock, MockProxy } from 'jest-mock-extended';
import { PaymentInterface } from 'src/models/payment.model';
import { RefundInterface } from 'src/models/refund.model';

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

  it('should fail authorization with ProviderA for invalid card number', async () => {
    jest.spyOn(service, 'selectProvider').mockReturnValue('ProviderA');

    const result = await service.authorizePayment(
      '5111111111111111',
      '08/25',
      123,
      100,
    );
    expect(result).toEqual({
      status: 'error',
      message: 'Invalid card details',
    });

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
});
