import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CapturePaymentRequest {
  @ApiProperty({
    description: 'Authorization token for the payment',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Amount to be captured from the authorized payment',
    example: 100.5,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
