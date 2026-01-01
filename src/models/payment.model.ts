import mongoose, { Document, Schema } from "mongoose";

export enum status {
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PENDING = "PENDING"
}
export interface IPayment extends Document {
    paymentId: mongoose.Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
    paymentMethod: string;
    transactionId: string;
    amountPaid: number;
    currency: string;
    status: status;
    timestamp: Date;
    additionalInfo?: string;
}

const PaymentSchema = new Schema<IPayment>(
    {
        orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
        paymentMethod: { type: String, required: true },
        transactionId: { type: String, required: true, unique: true },
        amountPaid: { type: Number, required: true },
        currency: { type: String, required: true },
        status: { type: String, enum: Object.values(status), default: status.PENDING },
        timestamp: { type: Date, default: Date.now },
        additionalInfo: { type: String },
    },
    { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

