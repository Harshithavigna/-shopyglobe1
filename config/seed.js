const dotenv = require("dotenv");
const connectDB = require("./db");
const Product = require("../models/Product");

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 49.99,
    description: "Over-ear wireless headphones with noise cancellation and 20-hour battery life.",
    stock: 50,
    category: "Electronics",
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 15.99,
    description: "Insulated 1-litre water bottle that keeps drinks cold for 24 hours.",
    stock: 120,
    category: "Home & Kitchen",
  },
  {
    name: "Running Shoes",
    price: 79.99,
    description: "Lightweight running shoes with breathable mesh upper and cushioned sole.",
    stock: 35,
    category: "Footwear",
  },
  {
    name: "Mechanical Keyboard",
    price: 89.99,
    description: "RGB backlit mechanical keyboard with blue switches.",
    stock: 25,
    category: "Electronics",
  },
  {
    name: "Yoga Mat",
    price: 22.5,
    description: "Non-slip 6mm thick yoga mat, eco-friendly TPE material.",
    stock: 60,
    category: "Sports & Fitness",
  },
];

const seedData = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log("Sample products inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedData();
