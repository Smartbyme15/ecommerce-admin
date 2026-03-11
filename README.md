# 🛍️ E-Commerce Product Admin Dashboard

A full-stack admin dashboard with JWT authentication, product CRUD, Cloudinary image uploads, and category filtering.

---

## 📁 Project Structure

```
ecommerce-admin/
├── backend/
│   ├── config/
│   │   ├── db.js              → MongoDB connection
│   │   └── cloudinary.js      → Cloudinary + Multer setup
│   ├── controllers/
│   │   ├── authController.js  → Register/Login/GetMe logic
│   │   └── productController.js → CRUD logic
│   ├── middleware/
│   │   └── authMiddleware.js  → JWT protection
│   ├── models/
│   │   ├── User.js            → Admin user schema
│   │   └── Product.js         → Product schema
│   ├── routes/
│   │   ├── authRoutes.js      → /api/auth/*
│   │   └── productRoutes.js   → /api/products/*
│   ├── server.js              → Entry point
│   ├── .env                   → Environment variables (NEVER commit!)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx → Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProductCard.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Products.jsx
    │   ├── App.jsx            → Routing
    │   ├── main.jsx           → Entry point
    │   └── index.css          → Global styles
    └── package.json
```

---

## ⚡ Quick Start

### Backend Setup

```bash
cd backend
npm install
# Fill in .env with your real credentials
npm run dev
# ✅ Server running on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# ✅ React app running on http://localhost:3000
```

---

## 🔑 How JWT Authentication Works

### What is a JWT Token?
A JSON Web Token (JWT) is a secure string that proves who you are. It has 3 parts separated by dots:
```
eyJhbGciOiJIUzI1NiJ9  ←  Header (algorithm)
.eyJpZCI6IjEyMyJ9      ←  Payload (your user ID)
.abc123signature        ←  Signature (tamper proof)
```

### How Token Flow Works:
```
1. User logs in → sends email + password to /api/auth/login
2. Backend verifies credentials → generates JWT token using JWT_SECRET
3. Token sent back to React frontend in API response
4. React stores token in localStorage (persists after page refresh)
5. Every future API request includes token in Authorization header:
   Authorization: Bearer eyJhbGci...
6. Backend middleware verifies token → allows or rejects request
```

### Where Token is Stored in React:
```js
// Saving after login (AuthContext.jsx)
localStorage.setItem('adminUser', JSON.stringify(userData));

// Reading on app load
const storedUser = localStorage.getItem('adminUser');

// Removing on logout
localStorage.removeItem('adminUser');
```

### How Token is Attached in Axios:
```js
// Set ONCE — applies to all future requests automatically
axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
```

### How to Send Bearer Token in Postman:
1. Click the **Authorization** tab in your request
2. Select **Bearer Token** from the dropdown
3. Paste your token in the Token field
4. Click **Send** — Postman adds `Authorization: Bearer <token>` automatically

---

## 🗄️ MongoDB Setup (Step by Step)

### 1. Create Free Cluster
- Go to https://cloud.mongodb.com
- Click **"Try Free"** → Create account
- Choose **M0 Free Tier** → Select region → Name cluster → **Create**

### 2. Create Database User
- Left sidebar → **Database Access** → **Add New Database User**
- Username: `adminUser`, Password: (generate secure one)
- Role: **Atlas Admin** → **Add User**

### 3. Allow IP Access
- Left sidebar → **Network Access** → **Add IP Address**
- Click **"Allow Access from Anywhere"** (0.0.0.0/0) for development
- **Confirm**

### 4. Get Connection String
- **Database** → **Connect** → **Connect your application**
- Driver: Node.js → Copy the string:
  ```
  mongodb+srv://adminUser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true
  ```
- Replace `<password>` with your actual password
- Add database name: `...mongodb.net/ecommerce?retryWrites...`

### 5. Paste in .env
```env
MONGO_URI=mongodb+srv://adminUser:yourpassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### 6. Check Collections in Atlas
- **Database** → **Browse Collections**
- You'll see: `ecommerce` database with `users` and `products` collections
- Click any document to view its fields (name, email, password hash, etc.)

---

## ☁️ Cloudinary Setup

### 1. Create Account
- Go to https://cloudinary.com → **Sign Up Free**

### 2. Get Credentials
- Dashboard shows: **Cloud Name**, **API Key**, **API Secret**
- Copy all 3 into your `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### 3. Where Images Appear
- Cloudinary Dashboard → **Media Library** → **products** folder
- Each image has a URL like:
  ```
  https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/products/filename.jpg
  ```
- This URL is saved in MongoDB `products.images` array

---

## 🔌 API Reference

### Auth Routes (Public)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | `{name, email, password}` | Create admin |
| POST | /api/auth/login | `{email, password}` | Login, get token |
| GET | /api/auth/me | — (needs token) | Get current admin |

### Product Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | ❌ | Get all products |
| GET | /api/products?category=Shoes | ❌ | Filter by category |
| GET | /api/products/:id | ❌ | Get single product |
| POST | /api/products | ✅ | Add product + images |
| PUT | /api/products/:id | ✅ | Update product |
| DELETE | /api/products/:id | ✅ | Delete product |

---

## 🧪 Postman Testing Guide

### Step 1: Register Admin
- Method: **POST**
- URL: `http://localhost:5000/api/auth/register`
- Body → **raw** → **JSON**:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```
- Hit **Send** → Copy the `token` from the response

### Step 2: Login
- Method: **POST**
- URL: `http://localhost:5000/api/auth/login`
- Same JSON body as above
- Copy token from response

### Step 3: Add Product with Images
- Method: **POST**
- URL: `http://localhost:5000/api/products`
- **Authorization** tab → Bearer Token → paste your token
- Body → **form-data**:
  - `name` → Text → "Nike Air Max"
  - `price` → Text → "150"
  - `category` → Text → "Shoes"
  - `stock` → Text → "50"
  - `images` → **File** → select image file(s)
- Hit **Send**

### Step 4: Get All Products
- Method: **GET**
- URL: `http://localhost:5000/api/products`
- No auth needed — hit **Send**

### Step 5: Filter by Category
- Method: **GET**
- URL: `http://localhost:5000/api/products?category=Shoes`

### Step 6: Update Product (change stock)
- Method: **PUT**
- URL: `http://localhost:5000/api/products/<product_id>`
- Authorization: Bearer token
- Body → form-data: `stock` → Text → `25`

### Step 7: Delete Product
- Method: **DELETE**
- URL: `http://localhost:5000/api/products/<product_id>`
- Authorization: Bearer token

---

## 🔒 Environment Variables Explained

### Why use .env?
Your MongoDB password, Cloudinary API key, and JWT secret are sensitive. If you hardcode them in your code and push to GitHub, **anyone can access your database and cloud storage.**

### .env file (backend root):
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET=make_this_very_long_and_random_like_this_abc123xyz789
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Protect it with .gitignore:
```
# backend/.gitignore
node_modules/
.env
```
This tells Git to **never track** the .env file.

### How variables are accessed in code:
```js
// First: dotenv.config() in server.js loads .env
const secret = process.env.JWT_SECRET;  // Reads from .env
const uri = process.env.MONGO_URI;
```

---

## 📦 Product Schema Fields

```js
{
  name: String,          // "Nike Air Max" — required
  description: String,   // "Comfortable running shoe"
  price: Number,         // 150.00 — required
  category: String,      // "Shoes" — required
  stock: Number,         // 50 — defaults to 0, min 0
  images: [String],      // Array of Cloudinary URLs
  createdAt: Date,       // Auto-added by timestamps: true
  updatedAt: Date        // Auto-added by timestamps: true
}
```

---

## 🛡️ Stock Validation

Stock cannot go below 0. Enforced in two places:

**Backend (Mongoose schema)**:
```js
stock: { type: Number, min: [0, 'Stock cannot go below 0'] }
```

**Backend (update controller)**:
```js
if (Number(stock) < 0) {
  return res.status(400).json({ message: 'Stock cannot be negative' });
}
```

**Frontend (Products.jsx form)**:
```html
<input type="number" name="stock" min="0" />
```

---

## 🔄 Category Filter Flow

```
Frontend dropdown changes → selectedCategory state updates
→ Axios GET /api/products?category=Shoes
→ Backend: filter = { category: /Shoes/i } (case-insensitive)
→ Returns filtered products → React re-renders cards
```

---

## 🚀 Running the Project

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Starts with nodemon (auto-restarts on code changes)
# You should see:
# 🚀 Server running on http://localhost:5000
# ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net

# Terminal 2 — Frontend  
cd frontend
npm run dev
# You should see:
# ➜  Local:   http://localhost:3000
```

Open http://localhost:3000 → Register → Login → Manage Products! 🎉

---

## ✅ Feature Checklist

- [x] JWT Authentication (Register + Login)
- [x] Protected API routes with middleware
- [x] Protected React routes (redirect if no token)
- [x] Product CRUD (Create, Read, Update, Delete)
- [x] Multiple image upload via Cloudinary
- [x] Category filter (backend query + frontend dropdown)
- [x] Stock validation (cannot go below 0)
- [x] Environment variable security
- [x] React Context API for auth state
- [x] Axios with automatic Bearer token headers
- [x] Dashboard with stats
- [x] Clean, responsive UI
