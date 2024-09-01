import { IsString, IsNotEmpty } from 'class-validator';

export class RefundPaymentRequest {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;
}
