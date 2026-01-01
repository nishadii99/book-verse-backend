import mongoose, { Document, Schema } from "mongoose";

export enum status {
  PENDING = "PENDING PAYMENT",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}
export interface IOrder extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: [{bookId : {type: mongoose.Types.ObjectId, required: true}, quantity: {type: Number, required: true}}];
  totalCost: number;
  status: status;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
        quantity: { type: Number, required: true },
      },
    ],  
    totalCost: { type: Number, required: true },
    status: { type: String, enum: Object.values(status), default: status.PENDING },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);