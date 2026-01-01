import { Request, Response } from "express"
import { AuthRequest } from "../middleware/auth"
import cloudinary from "../config/cloudinary"
import { Book } from "../models/book.model"

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const { title, price, description, quantity, author, tags } = req.body
    let imageURL = ""

    if (req.file) {
      const result: any = await new Promise((resole, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "books" },
          (error, result) => {
            if (error) {
              return reject(error)
            }
            resole(result) // success return
          }
        )
        upload_stream.end(req.file?.buffer)
      })
      imageURL = result.secure_url
    }
    // "one,two,tree"
    const newBook = new Book({
      title,
      price,
      description,
      quantity,
      author,
      tags: tags.split(","),
      imageURL // from auth middleware
    })
    await newBook.save()

    res.status(201).json({
      message: "Book created",
      data: newBook
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Fail to create book" })
  }
  //   req.user
  //   //  {
  //   //   sub: user._id.toString(),
  //   //   roles: user.roles
  //   // }
  //   req.user.sub
  //   req.user.roles
  //   req.user.sub // userId
}

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    // pagination
    const page = parseInt(req.query.page as string) | 1
    const limit = parseInt(req.query.limit as string) | 10
    const skip = (page - 1) * limit

    const books = await Book.find()
      .sort({ createdAt: -1 }) // change order
      .skip(skip) // ignore data for pagination
      .limit(limit) // data cound currently need

    const total = await Book.countDocuments()
    res.status(200).json({
      message: "Books data",
      data: books,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch books" })
  }
}

export const editBook = async (req: AuthRequest, res: Response) => {
    console.log(req.body)
  // to be implemented
  try {
    const { title, price, description, quantity, author, tags } = req.body
    const { id } = req.params
    const book = await Book.findById(id)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }
    let imageURL = ""

    if (req.file) {
      const result: any = await new Promise((resole, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "books" },
          (error, result) => {
            if (error) {
              return reject(error)
            }
            resole(result) // success return
          }
        )
        upload_stream.end(req.file?.buffer)
      })
      imageURL = result.secure_url
    }
    book.title = title
    book.price = price
    book.description = description
    book.quantity = quantity
    book.author = author
    book.tags = tags.split(",")
    if (imageURL) {
        book.imageURL = imageURL
    }
    await book.save()

    res.status(200).json({
        message: "Book updated",
        data: book
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to edit book" })
  }
}

export const deleteBook = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params
        const book = await Book.findByIdAndDelete(id)
        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }
        res.status(200).json({
            message: "Book deleted successfully"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to delete book" })
    }
}

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { query } = req.query
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query parameter is required" })
    }
    const books = await Book.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { tags: { $regex: query, $options: "i" } }
        ]
    })
    res.status(200).json({
        message: "Search results",
        data: books

    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to search books" })
  }
}
