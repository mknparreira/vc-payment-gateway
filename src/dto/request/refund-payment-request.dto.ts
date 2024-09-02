import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class RefundPaymentRequest {
  @ApiProperty({
    description: 'Transaction ID for the payment to be refunded',
    example: 'f7g8h9i0-j1k2-l3m4-n5o6-p7q8r9s0t1u2',
  })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiProperty({
    description: 'Amount to be refunded',
    example: 50.0,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
