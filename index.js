const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
// Load environment variables from .env
dotenv.config();
// Connect to MongoDB
connectDB();
const app = express();
// Middleware to parse incoming JSON request bodies
app.use(express.json());
// Simple health check route
app.get("/", (req, res) => {
  res.json({ message: "ShoppyGlobe API is running" });
});
// Mount routers
// authRoutes internally defines POST /register and POST /login,
// so it is mounted at the root path.
app.use("/", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
// 404 handler for unknown routes
app.use(notFound);
// Centralized error handler (must be last)
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ShoppyGlobe server running on port ${PORT}`);
});
module.exports = app;
