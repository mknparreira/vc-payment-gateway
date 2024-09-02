import { ApiProperty } from '@nestjs/swagger';

export class AuthorizePaymentResponse {
  @ApiProperty({
    description: 'Status of the payment authorization',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Authorization token for the payment',
    example: 'd2a54c47-f1a2-4d1e-bc5e-9a11a638f879',
    required: false,
  })
  auth_token?: string;

  @ApiProperty({
    description: 'Error message if the payment authorization fails',
    example: 'Invalid card details',
    required: false,
  })
  message?: string;
}
