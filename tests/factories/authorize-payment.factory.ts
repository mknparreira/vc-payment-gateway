import { AuthorizePaymentRequest } from 'src/dto/request/authorize-payment-request.dto';

/**
 * Factory function to create an instance of AuthorizePaymentRequest.
 * @param card_number - The card number to set.
 * @param amount - The amount to set.
 * @param cvv - The cvv number.
 * @param expiry_date - The expiry date to set.
 * @returns A new instance of AuthorizePaymentRequest with provided values.
 */

interface AuthorizePaymentInterface {
  card_number?: string;
  amount?: number;
  cvv?: number;
  expiry_date?: string;
}

/**
 * Factory function to create an instance of AuthorizePaymentRequestDto.
 * @param options - An object with optional parameters to set.
 * @returns A new instance of AuthorizePaymentRequestDto with provided values.
 */
export function AuthorizePaymentFactory(
  options: AuthorizePaymentInterface = {},
): AuthorizePaymentRequest {
  const dto = new AuthorizePaymentRequest();
  dto.card_number = options.card_number ?? '4111111111111111';
  dto.amount = options.amount ?? 100;
  dto.cvv = options.cvv ?? 123;
  dto.expiry_date = options.expiry_date ?? '12/25';

  return dto;
}
