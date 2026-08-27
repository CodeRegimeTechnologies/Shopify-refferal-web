import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingBag } from 'react-icons/fi';

function Navbar() {
  const { user, isAuthenticated, isAgent, logout } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <FiShoppingBag style={{ marginRight: 8 }} />
          ReferralShop
        </Link>
        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/products" className={isActive('/products')}>Products</Link>
          {isAuthenticated ? (
            <>
              {isAgent && <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>}
              <span style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>
                {user?.first_name || user?.username}
              </span>
              <button onClick={logout} className="btn btn-sm btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')}>Login</Link>
              <Link to="/register"><button className="btn btn-sm btn-primary">Join Now</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
