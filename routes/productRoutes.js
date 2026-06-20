const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
} = require("../controllers/productController");

// GET /products - list all products
router.get("/", getProducts);

// POST /products - create a product (for seeding/testing)
router.post("/", createProduct);

// GET /products/:id - get a single product by ID
router.get("/:id", getProductById);

module.exports = router;
