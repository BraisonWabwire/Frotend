// src/components/Navbar.jsx
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { logout } from '../api/auth'
import './Navbar.css'

export default function Navbar() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const toggleMenu = () => setMenuOpen(!menuOpen)
    const closeMenu = () => setMenuOpen(false)

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
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation links */}
                <nav className={`nav-menu ${menuOpen ? 'active' : ''}`}>
                    <ul className="nav-list">
                        <li>
                            <NavLink
                                to="/products"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                                onClick={closeMenu}
                            >
                                Products
                            </NavLink>
                        </li>

                        {user ? (
                            <>
                                <li>
                                    <NavLink
                                        to="/dashboard"
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

                                <li className="user-section">
                                    <span className="username">{user.username}</span>
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
    )
}