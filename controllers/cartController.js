const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

// @route   GET /cart
// @desc    Get all cart items for the logged-in user
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cartItems = await Cart.find({ user: req.user._id }).populate(
    "product",
    "name price description stock imageUrl"
  );

  res.status(200).json({ success: true, count: cartItems.length, data: cartItems });
});

// @route   POST /cart
// @desc    Add a product to the cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("productId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID format");
  }

  // Validate that the product actually exists before adding to cart
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const qty = quantity && quantity > 0 ? quantity : 1;

  if (product.stock < qty) {
    res.status(400);
    throw new Error("Requested quantity exceeds available stock");
  }

  // If the item is already in the cart, increase the quantity instead of duplicating
  let cartItem = await Cart.findOne({ user: req.user._id, product: productId });

  if (cartItem) {
    cartItem.quantity += qty;
    await cartItem.save();
  } else {
    cartItem = await Cart.create({
      user: req.user._id,
      product: productId,
      quantity: qty,
    });
  }

  cartItem = await cartItem.populate("product", "name price description stock imageUrl");

  res.status(201).json({ success: true, message: "Product added to cart", data: cartItem });
});

// @route   PUT /cart/:id
// @desc    Update quantity of a cart item (id = cart item ID)
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid cart item ID format");
  }

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be a number greater than or equal to 1");
  }

  const cartItem = await Cart.findById(id);

  if (!cartItem) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  // Ensure users can only modify their own cart items
  if (cartItem.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this cart item");
  }

  const product = await Product.findById(cartItem.product);
  if (product && quantity > product.stock) {
    res.status(400);
    throw new Error("Requested quantity exceeds available stock");
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  const updated = await cartItem.populate("product", "name price description stock imageUrl");

  res.status(200).json({ success: true, message: "Cart item updated", data: updated });
});

// @route   DELETE /cart/:id
// @desc    Remove a product from the cart (id = cart item ID)
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid cart item ID format");
  }

  const cartItem = await Cart.findById(id);

  if (!cartItem) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  if (cartItem.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to remove this cart item");
  }

  await cartItem.deleteOne();

  res.status(200).json({ success: true, message: "Cart item removed" });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
