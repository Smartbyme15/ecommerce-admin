import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Electronics', 'Clothing', 'Shoes', 'Accessories', 'Home & Garden', 'Sports', 'Books', 'Toys'];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, outOfStock: 0, lowStock: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/products');
        const outOfStock = data.filter((p) => p.stock === 0).length;
        const lowStock = data.filter((p) => p.stock > 0 && p.stock <= 5).length;
        const uniqueCats = new Set(data.map((p) => p.category)).size;
        setStats({ total: data.length, outOfStock, lowStock, categories: uniqueCats });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">👋 Welcome back, {user?.name}!</h1>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Products</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: '#ef4444' }}>{stats.outOfStock}</div>
              <div className="stat-label">Out of Stock</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: '#f59e0b' }}>{stats.lowStock}</div>
              <div className="stat-label">Low Stock (≤5)</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.categories}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>🚀 Quick Actions</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products" style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                📦 Manage Products
              </Link>
              <Link to="/products" style={{
                background: '#10b981',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                ➕ Add New Product
              </Link>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginTop: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>📂 Browse by Category</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  style={{
                    background: '#ede9fe',
                    color: '#7c3aed',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.85rem'
                  }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
