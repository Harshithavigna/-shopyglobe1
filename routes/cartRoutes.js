const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// All cart routes require a valid JWT (user must be logged in)
router.use(protect);

// GET /cart - view current user's cart
router.get("/", getCart);

// POST /cart - add a product to the cart
router.post("/", addToCart);

// PUT /cart/:id - update quantity of a cart item
router.put("/:id", updateCartItem);

// DELETE /cart/:id - remove an item from the cart
router.delete("/:id", removeCartItem);

module.exports = router;
