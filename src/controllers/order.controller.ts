import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Book } from "../models/book.model";
import { AuthRequest } from "../middleware/auth";

//placeOrder 
export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items are required" });
    }

    // Calculate total cost
    let totalCost = 0;

    for (const item of items) {
      const book = await Book.findById(item.bookId);

      if (!book) {
        return res.status(404).json({ success: false, message: `Book not found: ${item.bookId}` });
      }

      totalCost += book.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId,
      items,
      totalCost,
      status: "PENDING PAYMENT"
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Orders (ADMIN ONLY)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("userId", "email").populate("items.bookId", "title price");

    return res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//  Get Order By ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("userId", "email")
      .populate("items.bookId", "title price description");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Update Order Status (Admin Only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["PENDING PAYMENT", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    if (status === "SHIPPED") {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      for (const item of order.items) {
        const book = await Book.findById(item.bookId);
        if (book) {
          const itemQuantity = item.quantity as unknown as number;
          if (book.quantity < itemQuantity) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for book: ${book.title}`
            });
          }
          book.quantity -= itemQuantity;
          await book.save();
        }
      }
    }
    else if (status === "PAID") {
      console.log("Processing payment for order:", orderId);
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      await order.save();
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({
      success: true,
      message: "Order status updated",
      data: updatedOrder
    });

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
