const mongoose = require("mongoose");
// Each cart item links a user to a product with a quantity.
// One document per (user, product) pair.
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
  },
  { timestamps: true }
);
// Prevent the same user from having duplicate cart entries for the same product
cartSchema.index({ user: 1, product: 1 }, { unique: true });
module.exports = mongoose.model("Cart", cartSchema);
