import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { PaymentController } from 'src/controllers/payment.controller';
import { PaymentService } from 'src/services/payment.service';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: MockProxy<PaymentService>;

  beforeEach(async () => {
    service = mock<PaymentService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [{ provide: PaymentService, useValue: service }],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should return authorization token', async () => {
    service.authorizePayment.mockResolvedValue({
      status: 'success',
      auth_token: 'token',
    });

    const result = await controller.authorize({
      card_number: '4111111111111111',
      expiry_date: '08/25',
      amount: 100,
    });

    expect(result).toEqual({ status: 'success', auth_token: 'token' });
  });

  it('should capture payment successfully', async () => {
    service.capturePayment.mockResolvedValue({
      status: 'success',
      transaction_id: 'tx123',
    });

    const result = await controller.capture({
      token: 'auth_token',
      amount: 100,
    });
    expect(result).toEqual({ status: 'success', transaction_id: 'tx123' });
    expect(service.capturePayment).toHaveBeenCalledWith('auth_token', 100);
  });

  it('should refund payment successfully', async () => {
    service.refundPayment.mockResolvedValue({ status: 'success' });

    const result = await controller.refund({ transaction_id: 'tx123' });
    expect(result).toEqual({ status: 'success' });
    expect(service.refundPayment).toHaveBeenCalledWith('tx123');
  });
});
