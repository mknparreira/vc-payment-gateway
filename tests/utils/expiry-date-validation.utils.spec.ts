import { validate } from 'class-validator';
import { AuthorizePaymentRequest } from 'src/dto/request/authorize-payment-request.dto';
import { AuthorizePaymentFactory } from '../factories/authorize-payment.factory';

describe('IsValidExpiryDate', () => {
  it('should validate a correct expiry date in the future', async () => {
    const dto: AuthorizePaymentRequest = AuthorizePaymentFactory();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should invalidate an incorrect expiry date in the past', async () => {
    const dto: AuthorizePaymentRequest = AuthorizePaymentFactory({
      expiry_date: '12/20',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isValidExpiryDate).toBeDefined();
  });

  it('should invalidate an incorrectly formatted expiry date', async () => {
    const dto: AuthorizePaymentRequest = AuthorizePaymentFactory({
      expiry_date: '13/25',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.matches).toBeDefined();
  });

  it('should invalidate an expiry date that is invalid but correctly formatted', async () => {
    const dto: AuthorizePaymentRequest = AuthorizePaymentFactory({
      expiry_date: '00/25',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.matches).toBeDefined();
  });
});
