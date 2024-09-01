import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CapturePaymentRequest {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
