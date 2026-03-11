const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// @desc    Add new product
// @route   POST /api/products
// @access  Private (requires JWT)
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Collect uploaded image URLs from Cloudinary
    // req.files is set by Multer after uploading to Cloudinary
    const images = req.files ? req.files.map((file) => file.path) : [];

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      images,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (with optional category filter)
// @route   GET /api/products?category=Shoes
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    // Build filter object — if category provided, filter; otherwise get all
    const filter = category ? { category: { $regex: category, $options: 'i' } } : {};

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (requires JWT)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, category, stock } = req.body;

    // Validate stock: cannot go below 0
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // If new images uploaded, add them; otherwise keep existing
    const newImages = req.files ? req.files.map((file) => file.path) : [];
    const updatedImages = newImages.length > 0 ? [...product.images, ...newImages] : product.images;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        description: description !== undefined ? description : product.description,
        price: price || product.price,
        category: category || product.category,
        stock: stock !== undefined ? Number(stock) : product.stock,
        images: updatedImages,
      },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (requires JWT)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary too
    for (const imageUrl of product.images) {
      // Extract public_id from Cloudinary URL
      const parts = imageUrl.split('/');
      const filename = parts[parts.length - 1].split('.')[0];
      const publicId = `products/${filename}`;
      await cloudinary.uploader.destroy(publicId);
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProduct, getProducts, getProductById, updateProduct, deleteProduct };
