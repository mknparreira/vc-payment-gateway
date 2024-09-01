import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class RefundPaymentRequest {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
