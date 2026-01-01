import mongoose, { Document, Schema } from "mongoose"

export interface IBook extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  price: number
  description: string
  quantity: number
  author: string // for userId
  imageURL?: string
  tags?: string[]
  createdAt?: Date
  updatedAt?: Date

}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    author: { type: String, required: true },
    imageURL: String,
    tags: [String]
  },
  {
    timestamps: true
  }
)

export const Book = mongoose.model<IBook>("Book", BookSchema)
