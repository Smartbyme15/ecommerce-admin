
const ProductCard = ({ product, onEdit, onDelete }) => {
  const isLowStock = product.stock <= 5;

  return (
    <div className="product-card">
      {/* Product Image */}
      {product.images && product.images.length > 0 ? (
        <img
          className="product-card-image"
          src={product.images[0]}
          alt={product.name}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="product-card-image-placeholder">📦</div>
      )}

      <div className="product-card-body">
        <div className="product-card-name">{product.name}</div>
        <span className="product-card-category">{product.category}</span>
        <div className="product-card-price">${Number(product.price).toFixed(2)}</div>
        <div className={`product-card-stock ${isLowStock ? 'low' : ''}`}>
          Stock: {product.stock} {isLowStock && '⚠️ Low'}
        </div>

        <div className="product-card-actions">
          <button className="btn-edit" onClick={() => onEdit(product)}>
            ✏️ Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(product._id)}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
