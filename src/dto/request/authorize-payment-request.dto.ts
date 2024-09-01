import { IsString, IsNumber, IsNotEmpty, Matches } from 'class-validator';
import { IsValidExpiryDate } from 'src/utils/expiry-date-validation.utils';

export class AuthorizePaymentRequest {
  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/(\d{2})$/, {
    message: 'expiry_date must be in MM/YY format',
  })
  @IsValidExpiryDate({ message: 'expiry_date must be a valid date' })
  expiry_date: string;

  @IsNumber()
  @IsNotEmpty()
  cvv: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
