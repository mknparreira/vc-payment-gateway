import { Schema, model, Document } from 'mongoose';

export interface PaymentInterface extends Document {
  authorizationToken: string;
  amount: number;
  expiryDate: string;
  cvv: number;
  provider: 'ProviderA' | 'ProviderB';
  status: 'authorized' | 'captured' | 'refunded';
}

const paymentSchema = new Schema<PaymentInterface>({
  authorizationToken: { type: String, required: true },
  amount: { type: Number, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: Number, required: true },
  provider: { type: String, enum: ['ProviderA', 'ProviderB'], required: true },
  status: {
    type: String,
    enum: ['authorized', 'captured', 'refunded'],
    default: 'authorized',
  },
});

export const PaymentSchema = paymentSchema;

export const PaymentModel = model<PaymentInterface>('Payment', paymentSchema);
