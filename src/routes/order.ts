import { Router } from "express";
import { placeOrder, getAllOrders, getOrderById, updateOrderStatus } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// Place order
router.post("/place", authenticate, placeOrder);

// Get all orders
router.get("/all", authenticate, getAllOrders);

// Get order by id
router.get("/:id", authenticate, getOrderById);

// Update order status
router.patch("/:id/status", authenticate, updateOrderStatus);

export default router;
