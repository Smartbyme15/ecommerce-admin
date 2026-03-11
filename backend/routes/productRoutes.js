const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes — require JWT Bearer token
// upload.array('images', 5) → allows up to 5 images, field name must be "images"
router.post('/', protect, upload.array('images', 5), addProduct);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
