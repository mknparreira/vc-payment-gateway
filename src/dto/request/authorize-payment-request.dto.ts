import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Matches } from 'class-validator';
import { IsValidExpiryDate } from 'src/utils/expiry-date-validation.utils';

export class AuthorizePaymentRequest {
  @ApiProperty({
    description: 'Card number to authorize payment',
    example: '4111111111111111',
  })
  @IsString()
  @IsNotEmpty()
  card_number: string;

  @ApiProperty({
    description: 'Expiry date of the card in MM/YY format',
    example: '08/25',
  })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/(\d{2})$/, {
    message: 'expiry_date must be in MM/YY format',
  })
  @IsValidExpiryDate({ message: 'expiry_date must be a valid date' })
  expiry_date: string;

  @ApiProperty({
    description: 'CVV of the card',
    example: 123,
  })
  @IsNumber()
  @IsNotEmpty()
  cvv: number;

  @ApiProperty({
    description: 'Amount to be authorized for the payment',
    example: 100.5,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
