import { Request, Response } from "express";
import { Cart } from "../models/cart.model";
import { Book } from "../models/book.model";
import { AuthRequest } from "../middleware/auth";

// Add item to cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.sub; // logged in user
    const { bookId, quantity } = req.body;

    if (!bookId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Book ID and quantity are required" });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // Find user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart, create a new one
      cart = new Cart({
        userId,
        items: [{ bookId, quantity }]
      });
    } else {
      // If cart exists, check if book already in cart
      const existingItem = cart.items.find(item => item.bookId.toString() === bookId);
      if (existingItem) {
        existingItem.quantity += quantity; // update quantity
      } else {
        cart.items.push({ bookId, quantity }); // add new item
      }
    }

    await cart.save();

    return res.status(200).json({ success: true, message: "Item added to cart", data: cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};