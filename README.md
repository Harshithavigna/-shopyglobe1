# ShoppyGlobe Backend API

A RESTful backend for the **ShoppyGlobe** e-commerce application, built with **Node.js**, **Express.js**, and **MongoDB** (via Mongoose). Includes JWT-based authentication and protected cart routes.

---

## Tech Stack

- **Node.js** + **Express.js** — server & routing
- **MongoDB** + **Mongoose** — database & ODM
- **jsonwebtoken** — JWT authentication
- **bcryptjs** — password hashing
- **dotenv** — environment variable management

---

## Project Structure

```
shoppyglobe/
├── config/
│   ├── db.js              # MongoDB connection
│   └── seed.js            # Script to seed sample products
├── controllers/
│   ├── authController.js  # register/login logic
│   ├── productController.js
│   └── cartController.js
├── middleware/
│   ├── authMiddleware.js  # JWT "protect" middleware
│   ├── errorMiddleware.js # centralized error handling, 404 handler
│   └── asyncHandler.js    # wraps async route handlers
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Cart.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── cartRoutes.js
├── .env.example
├── .gitignore
├── index.js                # app entry point
├── package.json
└── README.md
```

---

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally, or a MongoDB Atlas connection string

### 2. Installation
```bash
git clone <your-repo-url>
cd shoppyglobe
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

```
MONGO_URI=mongodb://127.0.0.1:27017/shoppyglobe
PORT=5000
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
```

### 4. (Optional) Seed sample product data
```bash
npm run seed
```

### 5. Run the server
```bash
npm run dev    # with nodemon (auto-restart)
# or
npm start      # plain node
```

Server runs at `http://localhost:5000` by default.

---

## API Reference

### Auth Routes (Public)

| Method | Endpoint    | Description                  | Body                                  |
|--------|-------------|-------------------------------|----------------------------------------|
| POST   | `/register` | Register a new user           | `{ "name", "email", "password" }`     |
| POST   | `/login`    | Login & receive a JWT token   | `{ "email", "password" }`             |

**Response** (register/login):
```json
{
  "success": true,
  "data": { "_id": "...", "name": "...", "email": "...", "token": "<JWT>" }
}
```

Use the returned `token` in the `Authorization` header for protected routes:
```
Authorization: Bearer <token>
```

### Product Routes (Public)

| Method | Endpoint        | Description                        |
|--------|-----------------|-------------------------------------|
| GET    | `/products`     | Fetch list of all products          |
| GET    | `/products/:id` | Fetch a single product by ID        |
| POST   | `/products`     | Create a product (for testing/seed) |

### Cart Routes (Protected — requires JWT)

| Method | Endpoint    | Description                          | Body                                |
|--------|-------------|----------------------------------------|---------------------------------------|
| GET    | `/cart`     | Get logged-in user's cart items        | —                                      |
| POST   | `/cart`     | Add a product to the cart              | `{ "productId", "quantity" }`         |
| PUT    | `/cart/:id` | Update quantity of a cart item (`:id` = cart item ID) | `{ "quantity" }` |
| DELETE | `/cart/:id` | Remove an item from the cart           | —                                      |

---

## Error Handling & Validation

- Centralized error-handling middleware returns consistent JSON: `{ "success": false, "message": "..." }`
- Invalid MongoDB ObjectIds return `400 Bad Request`
- Missing/invalid required fields return `400 Bad Request`
- Non-existent products/cart items return `404 Not Found`
- Adding a non-existent product to the cart is blocked with a validation check
- Requesting more quantity than available stock is blocked
- Unauthorized cart route access (no/invalid token) returns `401 Unauthorized`
- Attempting to modify another user's cart item returns `403 Forbidden`

---

## Testing with ThunderClient

1. Install the **Thunder Client** extension in VS Code.
2. Create a new request collection called `ShoppyGlobe`.
3. Test in this order:
   - `POST /register` → create a user
   - `POST /login` → copy the returned `token`
   - `GET /products` → confirm seeded products appear
   - `GET /products/:id` → use a real product `_id`
   - In Thunder Client, add an `Authorization` header (`Bearer <token>`) to all cart requests
   - `POST /cart` → add a product using its `_id` as `productId`
   - `GET /cart` → verify the item was added
   - `PUT /cart/:id` → update quantity (use the cart item's `_id`, not the product's)
   - `DELETE /cart/:id` → remove the item
4. Take screenshots of each successful request/response and place them in a `/screenshots` folder for submission, alongside MongoDB Compass screenshots of the `products`, `users`, and `carts` collections.

---

## Notes

- Passwords are hashed with bcrypt before being stored — plaintext passwords are never saved.
- JWTs are signed with `JWT_SECRET` and expire based on `JWT_EXPIRES_IN`.
- The `Cart` collection enforces a unique `(user, product)` pair — adding the same product twice increases its quantity instead of duplicating the cart entry.
