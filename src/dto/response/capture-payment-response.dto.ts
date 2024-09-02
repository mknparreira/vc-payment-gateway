import { ApiProperty } from '@nestjs/swagger';

export class CapturePaymentResponse {
  @ApiProperty({
    description: 'Status of the payment capture',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Transaction ID for the captured payment',
    example: 'a5d9e6c1-1b3e-4e6a-9b36-5d6e2f9b8a31',
    required: false,
  })
  transaction_id?: string;

  @ApiProperty({
    description: 'Error message if the payment capture fails',
    example: 'Capture amount does not match authorized amount',
    required: false,
  })
  message?: string;
}
