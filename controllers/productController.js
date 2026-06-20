const mongoose = require("mongoose");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

// @route   GET /products
// @desc    Fetch list of all products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @route   GET /products/:id
// @desc    Fetch a single product by ID
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid product ID format");
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ success: true, data: product });
});

// @route   POST /products
// @desc    Create a new product (useful for seeding/testing data)
// @access  Public (could be protected/admin-only in a production app)
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, stock, category, imageUrl } = req.body;

  if (!name || price === undefined || !description || stock === undefined) {
    res.status(400);
    throw new Error("Please provide name, price, description, and stock");
  }

  const product = await Product.create({
    name,
    price,
    description,
    stock,
    category,
    imageUrl,
  });

  res.status(201).json({ success: true, data: product });
});

module.exports = { getProducts, getProductById, createProduct };
