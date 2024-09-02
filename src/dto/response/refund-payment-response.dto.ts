import { ApiProperty } from '@nestjs/swagger';

export class RefundPaymentResponse {
  @ApiProperty({
    description: 'Status of the refund request',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Error message if the refund request fails',
    example: 'Invalid transaction ID or refund already processed',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'Refund ID for the processed refund',
    example: 'c4f9e6c1-5b3e-4e6a-9b36-5d6e2f9b8a32',
    required: false,
  })
  refund_id?: string;
}
