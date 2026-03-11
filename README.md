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

stats
- [x] Clean, responsive UI
