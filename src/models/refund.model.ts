import { Schema, model, Document } from 'mongoose';

export interface RefundInterface extends Document {
  transactionId: string;
  amount: number;
  refundId: string;
  status: 'requested' | 'completed';
}

const refundSchema = new Schema<RefundInterface>({
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  refundId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['requested', 'completed'],
    default: 'requested',
  },
});

export const RefundSchema = refundSchema;
export const RefundModel = model<RefundInterface>('Refund', refundSchema);
