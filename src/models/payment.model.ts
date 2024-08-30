import { Schema, model, Document } from 'mongoose';

// Define the TypeScript interface for the Payment model
export interface PaymentInterface extends Document {
  authorizationToken: string;
  amount: number;
  provider: 'ProviderA' | 'ProviderB';
  status: 'authorized' | 'captured' | 'refunded';
}

const paymentSchema = new Schema<PaymentInterface>({
  authorizationToken: { type: String, required: true },
  amount: { type: Number, required: true },
  provider: { type: String, enum: ['ProviderA', 'ProviderB'], required: true },
  status: {
    type: String,
    enum: ['authorized', 'captured', 'refunded'],
    default: 'authorized',
  },
});

export const PaymentModel = model<PaymentInterface>('Payment', paymentSchema);
