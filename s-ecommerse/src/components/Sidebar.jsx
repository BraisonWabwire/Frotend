// src/components/Sidebar.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBox,
  faShoppingCart,
  faUsers,
  faSignOutAlt,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ 
  isOpen, 
  toggleSidebar, 
  activeSection, 
  setActiveSection 
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; // full page reload to clear auth state
  };

  return (
    <aside 
      className={`sidebar ${isOpen ? 'open' : ''}`}
      aria-label="Owner navigation sidebar"
      aria-hidden={!isOpen}
    >
      <div className="sidebar-header">
        <h3>ShopKE Owner</h3>
        <button 
          className="toggle-btn" 
          onClick={toggleSidebar}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <ul>
          {/* Overview – in-place */}
          <li
            className={activeSection === 'overview' ? 'active' : ''}
            onClick={() => setActiveSection('overview')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveSection('overview')}
          >
            <FontAwesomeIcon icon={faChartLine} /> Overview
          </li>

          {/* Products – in-place */}
          <li
            className={activeSection === 'products' ? 'active' : ''}
            onClick={() => setActiveSection('products')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveSection('products')}
          >
            <FontAwesomeIcon icon={faBox} /> Products
          </li>

          {/* Add Product – full navigation */}
          <li 
            onClick={() => navigate('/products/new')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/products/new')}
          >
            <FontAwesomeIcon icon={faBox} /> Add Product
          </li>

          {/* Orders – full navigation */}
          <li 
            onClick={() => navigate('/orders')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/orders')}
          >
            <FontAwesomeIcon icon={faShoppingCart} /> Orders
          </li>

          {/* Customers – full navigation */}
          <li 
            onClick={() => navigate('/customers')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/customers')}
          >
            <FontAwesomeIcon icon={faUsers} /> Customers
          </li>

          {/* Logout – full redirect */}
          <li 
            className="logout-item"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </li>
        </ul>
      </nav>
    </aside>
  );
}