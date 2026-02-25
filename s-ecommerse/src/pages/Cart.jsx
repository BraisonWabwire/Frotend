// src/pages/Cart.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import './Cart.css';

export default function Cart() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingItemId, setUpdatingItemId] = useState(null);

    // Redirect if not logged in or not a customer
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'customer') {
            navigate('/Owner/dashboard');
        }
    }, [user, navigate]);

    // Load cart
    useEffect(() => {
        if (user?.role === 'customer') {
            fetchCart();
        }
    }, [user]);

    const fetchCart = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await API.get('/cart/');
            setCart(res.data);
        } catch (err) {
            console.error('Cart fetch error:', err);
            setError('Failed to load cart. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItemId(itemId);

        try {
            await API.patch(`/cart/items/${itemId}/`, { quantity: newQuantity });
            // Refresh cart
            fetchCart();
        } catch (err) {
            console.error('Update quantity failed:', err);
            alert('Failed to update quantity');
        } finally {
            setUpdatingItemId(null);
        }
    };

    const removeItem = async (itemId) => {
        if (!window.confirm('Remove this item from cart?')) return;

        try {
            await API.delete(`/cart/items/${itemId}/`);
            fetchCart();
        } catch (err) {
            console.error('Remove failed:', err);
            alert('Failed to remove item');
        }
    };

    const handleCheckout = () => {
        // Placeholder — in real app: go to checkout page or initiate payment
        alert('Proceeding to checkout... (Payment integration coming soon)');
        // navigate('/checkout');
    };

    if (loading) {
        return <div className="cart-loading">Loading your cart...</div>;
    }

    if (error) {
        return <div className="cart-error">{error}</div>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your cart is empty</h2>
                <p>Start shopping to add items!</p>
                <button className="shop-now-btn" onClick={() => navigate('/Customer/dashboard')}>
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <>
        <Navbar/>
        <div className="cart-page">
            <h1 className="cart-title">Your Shopping Cart</h1>

            <div className="cart-layout">
                {/* Cart Items */}
                <div className="cart-items">
                    {cart.items.map((item) => (
                        <div key={item.id} className="cart-item">
                            {item.product.image && (
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="cart-item-image"
                                />
                            )}

                            <div className="cart-item-details">
                                <h3>{item.product.name}</h3>
                                <p className="item-price">KSh {Number(item.product.price).toLocaleString()}</p>
                                <div className="quantity-controls">
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={updatingItemId === item.id || item.quantity <= 1}
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>

                                    <span className="quantity">{item.quantity}</span>

                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={updatingItemId === item.id}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>

                            <div className="cart-item-total">
                                <p>KSh {Number(item.subtotal).toLocaleString()}</p>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeItem(item.id)}
                                    disabled={updatingItemId === item.id}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="cart-summary">
                    <h2>Order Summary</h2>

                    <div className="summary-row">
                        <span>Items ({cart.total_items})</span>
                        <span>KSh {Number(cart.total_price).toLocaleString()}</span>
                    </div>

                    <div className="summary-row">
                        <span>Delivery Fee (estimate)</span>
                        <span>KSh 300</span>
                    </div>

                    <div className="summary-total">
                        <span>Total</span>
                        <span>KSh {(Number(cart.total_price) + 300).toLocaleString()}</span>
                    </div>

                    <button className="checkout-button" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>

                    <p className="continue-shopping">
                        <button onClick={() => navigate('/Customer/dashboard')}>Continue Shopping</button>
                    </p>
                </div>
            </div>
        </div>
        </>
    );
}