
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        🛍️ Admin Panel
      </Link>

      <div className="navbar-right">
        {user && (
          <>
            <div className="navbar-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/products">Products</Link>
            </div>
            <span className="navbar-user">👤 {user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
