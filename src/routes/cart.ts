import { Router } from "express";
import { addToCart} from "../controllers/cart.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// Add item to cart (protected)
router.post("/add", authenticate, addToCart);

export default router;
