// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faShoppingCart, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import API from '../api/axiosInstance'; // your axios instance
import './Navbar.css';

export default function Navbar() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // Fetch cart count for customers only
    useEffect(() => {
        if (user?.role === 'customer') {
            const fetchCartCount = async () => {
                try {
                    const res = await API.get('/cart/');
                    setCartCount(res.data.total_items || 0);
                } catch (err) {
                    console.error('Failed to fetch cart count:', err);
                    setCartCount(0);
                }
            };
            fetchCartCount();

            // Optional: poll every 30 seconds or use WebSocket later
            const interval = setInterval(fetchCartCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        setUser(null);
        setMenuOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    // Dashboard path based on role
    const dashboardPath = user?.role === 'owner' ? '/Owner/dashboard' : '/customer/dashboard';

    return (
        <header className="navbar">
            <div className="navbar-container">

                {/* Logo */}
                <NavLink to="/" className="logo" onClick={closeMenu}>
                    Shop<span className="logo-accent">KE</span>
                </NavLink>

                {/* Hamburger */}
                <button
                    className={`hamburger ${menuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation */}
                <nav className={`nav-menu ${menuOpen ? 'active' : ''}`} aria-hidden={!menuOpen}>
                    <ul className="nav-list">
                        {user ? (
                            <>
                                <li>
                                    <NavLink
                                        to={dashboardPath}
                                        className={({ isActive }) => (isActive ? 'active' : '')}
                                        onClick={closeMenu}
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>

                                {user.role === 'owner' && (
                                    <li>
                                        <NavLink
                                            to="/products/new"
                                            className={({ isActive }) => (isActive ? 'active' : '')}
                                            onClick={closeMenu}
                                        >
                                            Add Product
                                        </NavLink>
                                    </li>
                                )}

                                {/* Cart icon – only for customers */}
                                {user?.role === 'customer' && (
                                    <li className="cart-icon-section">
                                        <NavLink
                                            to="/cart"
                                            className={({ isActive }) => (isActive ? 'active cart-active' : 'cart-link')}
                                            onClick={closeMenu}
                                            title="View Cart"
                                        >
                                            <div className="cart-icon-wrapper">
                                                <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                                                {cartCount > 0 && (
                                                    <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
                                                )}
                                            </div>
                                        </NavLink>
                                    </li>
                                )}

                                <li className="user-section">
                                    <button className="logout-button" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) => (isActive ? 'active' : '')}
                                        onClick={closeMenu}
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/register"
                                        className="register-link"
                                        onClick={closeMenu}
                                    >
                                        Register
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}