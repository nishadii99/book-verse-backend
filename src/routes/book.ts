import { Router } from "express"
import {
  createBook,
  getAllBooks,
  editBook,
  deleteBook,
  searchBooks
} from "../controllers/book.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"
import { upload } from "../middleware/upload"


const router = Router()

// only for Authors
router.post(
  "/create",
  authenticate,
  requireRole([Role.ADMIN]),
  upload.single("image"), // form data key name
  createBook
)

router.get("/all", getAllBooks)

router.post(
    "/:id", 
    authenticate, 
    requireRole([Role.ADMIN]), 
    upload.single("image"),
    editBook
)

router.delete(
    "/:id", 
    authenticate, 
    requireRole([Role.ADMIN]),
    deleteBook
)
//search
router.get(
    "/search",
    searchBooks
)


export default router;