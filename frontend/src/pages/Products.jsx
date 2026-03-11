import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Shoes', 'Accessories', 'Home & Garden', 'Sports', 'Books', 'Toys'];

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '', stock: ''
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch products from backend, with optional category filter
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      const { data } = await axios.get('/api/products', { params });
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // When category dropdown changes
  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    if (cat !== 'All') {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  // Open modal for adding new product
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setImages([]);
    setError('');
    setShowModal(true);
  };

  // Open modal for editing existing product
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setImages([]);
    setError('');
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // Submit form — either add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    // Stock validation
    if (Number(formData.stock) < 0) {
      setError('Stock cannot be negative');
      setFormLoading(false);
      return;
    }

    try {
      // Use FormData to support file uploads (multipart/form-data)
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      images.forEach((img) => data.append('images', img)); // "images" matches backend field name

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Product updated successfully!');
      } else {
        await axios.post('/api/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Product added successfully!');
      }

      setShowModal(false);
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${productId}`);
      setSuccess('Product deleted');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📦 Products</h1>
      </div>

      {success && <div className="success-msg">{success}</div>}
      {error && !showModal && <div className="error-msg">{error}</div>}

      {/* Toolbar: category filter + add button */}
      <div className="products-toolbar">
        <div className="category-filter">
          <select value={selectedCategory} onChange={handleCategoryChange}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button className="add-product-btn" onClick={openAddModal}>
          ➕ Add Product
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading">⏳ Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No products found. Add your first product!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Nike Air Max"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Product description..."
                />
              </div>

              <div className="two-col-form">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleFormChange} required>
                  <option value="">Select category...</option>
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Images (up to 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                {/* Preview selected images */}
                {images.length > 0 && (
                  <div className="image-preview-grid">
                    {images.map((img, i) => (
                      <img key={i} src={URL.createObjectURL(img)} alt={`preview-${i}`} />
                    ))}
                  </div>
                )}
                {/* Show existing images when editing */}
                {editingProduct?.images?.length > 0 && images.length === 0 && (
                  <div className="image-preview-grid" style={{ marginTop: '0.5rem' }}>
                    {editingProduct.images.map((url, i) => (
                      <img key={i} src={url} alt={`existing-${i}`} />
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
