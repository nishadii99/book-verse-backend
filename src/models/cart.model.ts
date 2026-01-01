import mongoose from "mongoose";

export interface ICart extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    items: [{ bookId: mongoose.Types.ObjectId; quantity: number }];
    createdAt?: Date;
    updatedAt?: Date;
}

const CartSchema = new mongoose.Schema<ICart>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        items: [
            { bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, quantity: { type: Number, required: true } }
        ],
    },
    { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", CartSchema);  
